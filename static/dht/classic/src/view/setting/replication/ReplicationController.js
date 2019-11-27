/**
 * Created by zen on 18. 7. 10.
 */
Ext.define('dht.view.setting.replication.ReplicationController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.replication',

  uses: [
    'Ext.util.Cookies'
  ],

  /**
   * Called when the view is created
   */
  init: function() {
  },
  loadReplicationStatus: function(store) {
    var me = this;
    var nodeInfo = [];
    var items = store.getData();
    if(items.length>=2) {
      items.each(function(item) {
        nodeInfo.push({
          name: item.get('hostname'),
          db_pool_status: item.get('db_pool_status'), // == 2,
          db_active: item.get('db_active'),
          isMaster: item.get('isMaster'),
          db_isMaster: item.get('db_isMaster'),
          watchdog_status: item.get('watchdog_status')
        })
      });
      this.drawDiagram(nodeInfo);
      me.statusRefreshHandler = setTimeout(function() {
        store.reload();
      }, 30 * 1000)
    }
  },
  drawDiagram: function(nodeInfo) {
    var me = this;
    if(me.diagram) {
      me.diagram.updateStatus(nodeInfo);
      return;
    }
    var myCanvas = this.lookupReference('myCanvas');
    me.diagram = (function() {
      var params = parseData(nodeInfo);
      var graph = new joint.dia.Graph();
      var paper = new joint.dia.Paper({
        el: myCanvas.getEl().dom,
        //width: 800,
        //height: 600,
        interactive: false,
        gridSize: 1,
        model: graph,
        snapLinks: true,
        linkPinning: false,
        embeddingMode: true,
        validateEmbedding: function(childView, parentView) {
          return parentView.model instanceof joint.shapes.devs.Coupled;
        },
        validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
          return sourceMagnet != targetMagnet;
        }
      });

      joint.shapes.html = {};
      joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
          type: 'html.Element',
          attrs: {text: {'ref-x': .5, 'ref-y': 20}}
        }, joint.shapes.basic.Rect.prototype.defaults)
      });
      joint.shapes.html.ElementView = joint.dia.ElementView.extend({
        template: [
          '<div class="my-html-element">',
          `<button class="clean-gray">${'복구'}</button>`,
          '</div>'
        ].join(''),
        initialize: function() {
          _.bindAll(this, 'updateBox');
          var enable_recovery = this.model.attr('enable_recovery');
          var enable_attach = this.model.attr('enable_attach');
          joint.dia.ElementView.prototype.initialize.apply(this, arguments);
          this.$box = $(joint.util.template(this.template)());
          var buttons = this.$box.find('button');
          this.enableRecoveryButton(enable_recovery, enable_attach);
          buttons.on('click', _.bind(function() {
            var code = buttons.data('action_type');
            if(code == 'attach') {
              me.requestAttachDB(this)
            } else if(code == 'recovery') {
              me.requestRecoveryDB(this)
            }
          }, this));
        },
        render: function() {
          joint.dia.ElementView.prototype.render.apply(this, arguments);
          this.paper.$el.append(this.$box);
          this.updateBox();
          return this;
        },
        updateBox: function() {
          var bbox = this.getBBox();
          this.$box.css({width: bbox.width + 2, height: bbox.height + 2, left: bbox.x, top: bbox.y});
        },
        enableRecoveryButton: function(enable_recovery, enable_attach) {
          var action_type;
          if(enable_recovery) action_type = 'recovery';
          if(enable_attach) action_type = 'attach';
          var buttons = this.$box.find('button');
          enable_recovery || enable_attach ? buttons.attr('disabled', false) : buttons.attr('disabled', true);
          buttons.data('action_type', action_type);
          buttons.text(action_type == 'attach' ? 'Attach' : '복구');
        }
      });

      var virtual_ip = new joint.shapes.devs.Atomic({
        position: {x: 300, y: 80}, size: {width: 200, height: 35}, attrs: {text: {text: 'Virtual ip'}}
      });
      var server1 = new joint.shapes.devs.Coupled({
        enable: params.server1_isMaster,
        position: {x: 100, y: 200},
        inPorts: ['in'],
        attrs: {
          text: {text: nodeInfo[0].name, 'ref-x': 40, 'ref-y': -25},
          '.inPorts circle': {magnet: 'passive', type: 'input', 'ref-x': 100, 'ref-y': -170, r: 5}
        },
        size: {width: 200, height: 340}
      });
      var server2 = new joint.shapes.devs.Coupled({
        enable: params.server2_isMaster,
        position: {x: 500, y: 200},
        inPorts: ['in'],
        attrs: {
          text: {text: nodeInfo[1].name, 'ref-x': 40, 'ref-y': -25},
          '.inPorts circle': {magnet: 'passive', type: 'input', 'ref-x': 100, 'ref-y': -170, r: 5}
        },
        size: {width: 200, height: 340}
      });
      var dbpool1 = new joint.shapes.devs.Atomic({
        enable: params.dbpool1_status == 2,
        attrs: {
          text: {text: 'db pool', style: {opacity: params.watchdog1_status ? 1 : .4}},
          rect: {style: {opacity: params.watchdog1_status ? 1 : .4}}, id: 'dbpool1'
        },
        size: {width: 100, height: 35},
        position: {x: 150, y: 250}
      });
      var dbpool2 = new joint.shapes.devs.Atomic({
        enable: params.dbpool2_status == 2,
        attrs: {
          text: {text: 'db pool', style: {opacity: params.watchdog2_status ? 1 : .4}},
          rect: {style: {opacity: params.watchdog2_status ? 1 : .4}}, id: 'dbpool2'
        },
        size: {width: 100, height: 35},
        position: {x: 550, y: 250}
      });
      var db1 = new joint.shapes.html.Element({
        enable: params.db1_status,
        attrs: {
          text: {
            text: params.db1_isMaster ? 'DB\n(master)' : 'DB\n(slave)', 'ref-y': 25
          }, nodeId: '0',
          enable_recovery: !params.db1_status,
          enable_attach: params.db1_status && params.dbpool1_status == 3
        },
        size: {width: 100, height: 100},
        position: {x: 150, y: 390}
      });
      var db2 = new joint.shapes.html.Element({
        enable: params.db2_status,
        attrs: {
          text: {
            text: params.db2_isMaster ? 'DB\n(master)' : 'DB\n(slave)', 'ref-y': 25
          }, nodeId: '1',
          enable_recovery: !params.db2_status,
          enable_attach: params.db2_status && params.dbpool2_status == 3
        },
        size: {width: 100, height: 100},
        position: {x: 550, y: 390}
      });
      graph.addCells([
        virtual_ip,
        server1, server2,
        dbpool1, dbpool2,
        db1, db2
      ]);
      server1.embed(dbpool1);
      server1.embed(db1);
      server2.embed(dbpool2);
      server2.embed(db2);

      var MyLink = joint.shapes.devs.Link.extend({
        markup: '<path class="connection"/><path class="marker-target"/><g class="labels" />'
      });

      //var connect = function(source, sourcePort, target, targetPort, routeMode) {
      var connect = function(opts) {
        var source = opts.source,
          target = opts.target,
          sourcePort = opts.sourcePort,
          targetPort = opts.targetPort;
        var link = new MyLink({
          source: {id: source.id, selector: sourcePort ? source.getPortSelector(sourcePort) : null},
          target: {id: target.id, selector: targetPort ? target.getPortSelector(targetPort) : null},
          router: {name: opts.route || 'normal'},
          connector: {name: 'rounded'},
          attrs: {
            '.connection': {
              stroke: '#333333',
              opacity: opts.enable ? 1 : 0.2,
              'stroke-width': opts.enable ? 3 : 2
            },
            '.marker-target': {
              fill: '#333333',
              opacity: opts.enable ? 1 : 0.2,
              d: 'M 10 0 L 0 5 L 10 10 z'
            }
          }
        });
        link.addTo(graph).reparent();
        return link;
      };
      var server1_link = connect({
        source: virtual_ip, target: server1, targetPort: 'in', route: 'manhattan',
        enable: params.server1_isMaster
      });
      var server2_link = connect({
        source: virtual_ip, target: server2, targetPort: 'in', route: 'manhattan',
        enable: params.server2_isMaster
      });
      var dbpool1_link = connect({
        source: server1, sourcePort: 'in', target: dbpool1,
        enable: params.server1_isMaster && params.dbpool1_status == 2
      });
      var dbpool2_link = connect({
        source: server2, sourcePort: 'in', target: dbpool2,
        enable: params.server2_isMaster && params.dbpool2_status == 2
      });
      var dbpool1_db1_link = connect({
        source: dbpool1, target: db1,
        enable: params.server1_isMaster && params.db1_status
      });
      var dbpool1_db2_link = connect({
        source: dbpool1, target: db2,
        enable: params.server1_isMaster && params.db2_status
      });
      var dbpool2_db1_link = connect({
        source: dbpool2, target: db1,
        enable: params.server2_isMaster && params.db1_status
      });
      var dbpool2_db2_link = connect({
        source: dbpool2, target: db2,
        enable: params.server2_isMaster && params.db2_status
      });

      if(!Ext.browser.is.IE){
        graph.on('signal', function(cell) {
          if(cell instanceof joint.dia.Link) {
            var targetCell = graph.getCell(cell.get('target').id);
            if(!targetCell || !targetCell.get('enable')) {
              return;
            }

            paper.findViewByModel(cell).sendToken(V('circle', {
              r: 7,
              fill: '#4d8fbb',
              opacity: 0.8
            }).node, 1000, function() {
              targetCell.trigger('signal', targetCell);
            });

          } else {
            var outboundLinks = graph.getConnectedLinks(cell, {outbound: true});
            _.each(outboundLinks, function(link) {
              link.trigger('signal', link);
            });
          }
        });
      }

      function updateStatus(nodeInfo) {
        // node Status
        var params = parseData(nodeInfo);
        server1.set('enable', params.server1_isMaster);
        server2.set('enable', params.server2_isMaster);
        dbpool1.set('enable', params.dbpool1_status == 2);
        dbpool1.attr({
          text: {style: {opacity: params.watchdog1_status ? 1 : .4}},
          rect: {style: {opacity: params.watchdog1_status ? 1 : .4}}
        });
        dbpool2.set('enable', params.dbpool2_status == 2);
        dbpool2.attr({
          text: {style: {opacity: params.watchdog2_status ? 1 : .4}},
          rect: {style: {opacity: params.watchdog2_status ? 1 : .4}}
        });
        db1.set('enable', params.db1_status);
        db2.set('enable', params.db2_status);
        db1.attr('text', {text: params.db1_isMaster ? 'DB\n(master)' : 'DB\n(slave)'});
        db2.attr('text', {text: params.db2_isMaster ? 'DB\n(master)' : 'DB\n(slave)'});
        // link Status
        updateLink(server1_link, params.server1_isMaster);
        updateLink(server2_link, params.server2_isMaster);
        updateLink(dbpool1_link, params.server1_isMaster && params.dbpool1_status == 2);
        updateLink(dbpool2_link, params.server2_isMaster && params.dbpool2_status == 2);
        updateLink(dbpool1_db1_link, params.server1_isMaster && params.db1_status);
        updateLink(dbpool1_db2_link, params.server1_isMaster && params.db2_status);
        updateLink(dbpool2_db1_link, params.server2_isMaster && params.db1_status);
        updateLink(dbpool2_db2_link, params.server2_isMaster && params.db2_status);
        function updateLink(link, value) {
          link.attr({
            '.connection': {
              opacity: value ? 1 : 0.2,
              'stroke-width': value ? 3 : 2
            },
            '.marker-target': {opacity: value ? 1 : 0.2}
          })
        }

        // db recovery button 활성화 여부
        paper.findViewByModel(db1).enableRecoveryButton(!params.db1_status, params.db1_status && params.dbpool1_status == 3);
        paper.findViewByModel(db2).enableRecoveryButton(!params.db2_status, params.db2_status && params.dbpool2_status == 3);
      }

      function animationStart() {
        virtual_ip.trigger('signal', virtual_ip);
      }

      function parseData(nodeInfo) {
        return {
          server1_isMaster: nodeInfo[0].isMaster,
          server2_isMaster: nodeInfo[1].isMaster,
          db1_isMaster: nodeInfo[0].db_isMaster,
          db2_isMaster: nodeInfo[1].db_isMaster,
          dbpool1_status: nodeInfo[0].db_pool_status,
          dbpool2_status: nodeInfo[1].db_pool_status,
          db1_status: nodeInfo[0].db_active,
          db2_status: nodeInfo[1].db_active,
          watchdog1_status: nodeInfo[0].watchdog_status,
          watchdog2_status: nodeInfo[1].watchdog_status
        }
      }

      return {
        updateStatus: updateStatus,
        animationStart: animationStart
      };
    })();
    me.animationStart();
  },
  requestRecoveryDB: function(db_node) {
    var nodeId = db_node.model.attr('nodeId');
    Ext.Msg.confirm('알림', Ext.String.format(`[DB-{0}] ${'복구를 진행 하시겠습니까?'}`, nodeId), function(text) {
      if(text == 'yes') {
        $.post('/replication/recovery', {nodeId: nodeId, csrfmiddlewaretoken: Ext.util.Cookies.get('csrftoken')}, function(res) {
          if(res.success) {
            db_node.enableRecoveryButton(false);
          } else {
            Ext.Msg.alert('알림', res.errmsg);
          }
        }, 'json');
      }
    });
  },
  requestAttachDB: function(db_node) {
    var nodeId = db_node.model.attr('nodeId');
    Ext.Msg.confirm('알림', Ext.String.format(`[DB-{0}] ${'연결 하시겠습니까?'}`, nodeId), function(text) {
      if(text == 'yes') {
        $.post('/replication/attach', {nodeId: nodeId, csrfmiddlewaretoken: Ext.util.Cookies.get('csrftoken')}, function(res) {
          if(res.success) {
            db_node.enableRecoveryButton(false);
          } else {
            Ext.Msg.alert('알림', res.errmsg);
          }
        }, 'json');

        // zenlog.ajax('/replication/attach', {nodeId: nodeId}, function(res) {
        //     if(res.success) {
        //         db_node.enableRecoveryButton(false);
        //     } else {
        //         Ext.Msg.alert('알림', res.errmsg);
        //     }
        // });
      }
    });
  },
  repeatRequestStart: function() {
    var me = this;
    if(me.diagram) {
      if(me.statusRefreshHandler) {
        clearInterval(this.statusRefreshHandler);
      }
      var vm = this.getViewModel();
      var store = vm.getStore('nodeInfo');
      store.reload();
      me.animationStart();
    }
  },
  animationStart: function() {
    var me = this;
    me.animationHandler = simulate();
    function simulate() {
      setTimeout(function() {
        me.diagram.animationStart();
      }, 0);
      return setInterval(function() {
        me.diagram.animationStart();
      }, 4000);
    }
  },
  repeatRequestStop: function() {
    if(this.animationHandler) {
      clearInterval(this.animationHandler);
    }
    if(this.statusRefreshHandler) {
      clearInterval(this.statusRefreshHandler);
    }
  },
  renderDBStatus: function(value) {
    if(value) {
      return "<b style='color:blue'>Running</b>";
    } else {
      return "<b style='color:red'>Stop</b>";
    }
  },

  onRefresh: function() {
    var grid = this.lookupReference('replication_grid_main');
    grid.getStore().load();
  }

});