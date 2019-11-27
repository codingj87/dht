Ext.define('dht.view.main.MainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.main',

  uses: ['dht.view.setting.user.UserWindow'],

  listen: {
    controller: {
      '#': {
        unmatchedroute: 'onRouteChange'
      }
    }
  },

  routes: {
    ':node': 'onRouteChange'
  },

  lastView: null,
  navigationBoxready: function() {
    var me = this,
      refs = me.getReferences(),
      navigationList = refs.navigationTreeList,
      wrapContainer = refs.mainContainerWrap;

    navigationList.on('resize', function() {
      wrapContainer.updateLayout();
    });
  },

  checkLicense: function() {
    try {
      if (parseInt(IPCOUNT) > parseInt(LICENSE)) {
        Ext.getCmp('id_currentIPCount').setFieldStyle('color: red;');
        Ext.getCmp('id_alertLicenseIcon').setHidden(false);
      }
    } catch (e) {
      console.log(e);
    }
  },

  setCurrentView: function(hashTag) {
    hashTag = (hashTag || '').toLowerCase();

    var me = this,
      refs = me.getReferences(),
      mainCard = refs.mainCardPanel,
      mainLayout = mainCard.getLayout(),
      navigationList = refs.navigationTreeList,
      store = navigationList.getStore(),
      node =
        store.findNode('routeId', hashTag) ||
        store.findNode('viewType', hashTag),
      view = (node && node.get('viewType')) || 'page404',
      lastView = me.lastView,
      existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
      newView;

    // Kill any previously routed window
    if (lastView && lastView.isWindow) {
      lastView.destroy();
    }

    lastView = mainLayout.getActiveItem();

    if (!existingItem) {
      newView = Ext.create({
        xtype: view,
        routeId: hashTag, // for existingItem search later
        hideMode: 'offsets'
      });
    }

    if (!newView || !newView.isWindow) {
      newView = Ext.create({
        xtype: view,
        routeId: hashTag, // for existingItem search later
        hideMode: 'offsets'
      });
      // !newView means we have an existing view, but if the newView isWindow
      // we don't add it to the card layout.
      if (existingItem) {
        // We don't have a newView, so activate the existing view.
        if (existingItem !== lastView) {
          mainLayout.setActiveItem(newView);
        }
        // newView = existingItem;
      } else {
        // newView is set (did not exist already), so add it and make it the
        // activeItem.
        Ext.suspendLayouts();
        mainLayout.setActiveItem(mainCard.add(newView));
        Ext.resumeLayouts(true);
      }
    }

    navigationList.setSelection(node);

    if (newView.isFocusable(true)) {
      newView.focus();
    }

    me.lastView = newView;
  },

  onNavigationTreeSelectionChange: function(tree, node) {
    var to = node && (node.get('routeId') || node.get('viewType'));

    if (to) {
      this.redirectTo(to);
    }
  },

  onMainViewRender: function() {
    // 날짜 오버라이드
    Ext.Date.monthNames = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월'
    ];
    Ext.Date.dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    if (!window.location.hash) {
      this.redirectTo('host');
    }

    var me = this,
      vm = me.getViewModel();
    vm.set('logout_time', new Date().getTime() + SESSION_IDLE_TIME * 1000);
    jQuery(document).ready(function() {
      $(document).mousedown(function() {
        vm.set('logout_time', new Date().getTime() + SESSION_IDLE_TIME * 1000);
      });
    });
    me.sessionLogout();
  },

  onRouteChange: function(id) {
    this.setCurrentView(id);
  },

  onSearchRouteChange: function() {
    this.setCurrentView('searchresults');
  },

  onEmailRouteChange: function() {
    this.setCurrentView('email');
  },

  userIDClick: function(cp) {
    cp.getEl().on('click', function() {
      dht.ajax('/user/read', { userid: USERID }, function(r) {
        new dht.view.setting.user.UserWindow({
          animateTarget: cp,
          viewModel: {
            data: { mode: 'update', formData: r.data, disabled: true }
          },
          listeners: {
            save: function() {
              this.close();
            }
          }
        }).show();
      });
    });
  },
  sessionLogout: function() {
    var vm = this.getViewModel();

    if (SESSION_IDLE_TIME_CHECK) {
      setInterval(function() {
        if (
          SESSION_IDLE_TIME_CHECK &&
          vm.get('logout_time') - new Date().getTime() < 0
        ) {
          // 두 번 확인 중요함
          location.href = '/logout';
        }
      }, 1000);
    }
  },
  renderTime: function() {
    var me = this,
      vm = me.getViewModel(),
      oldTime = vm.get('time'),
      now = new Date(),
      time = Ext.Date.format(new Date(), 'Y-m-d <b>D</b> H:i:s');

    if (oldTime != '' && time.split(' ')[0] != oldTime.split(' ')[0]) {
      location.reload();
    }

    vm.set('time', time);
    vm.set('time_int', now.getTime());
    Ext.defer(function() {
      me.renderTime();
    }, 1000);
  },

  onReady: function() {
    var me = this;
    me.renderTime();
  },

  onToggleNavigationSize: function(btn) {
    var me = this,
      refs = me.getReferences(),
      navigationList = refs.navigationTreeList,
      wrapContainer = refs.mainContainerWrap,
      collapsing = !navigationList.getMicro(),
      new_width = collapsing ? 50 : 200;

    collapsing
      ? refs.logoIcon.setMargin('5 5 5 5')
      : refs.logoIcon.setMargin('5 0 0 10');

    if (Ext.isIE9m || !Ext.os.is.Desktop) {
      Ext.suspendLayouts();

      refs.senchaLogo.setWidth(new_width);

      navigationList.setWidth(new_width);
      navigationList.setMicro(collapsing);

      Ext.resumeLayouts(); // do not flush the layout here...

      // No animation for IE9 or lower...
      wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
      wrapContainer.updateLayout(); // ... since this will flush them
    } else {
      // if(!collapsing) {
      //     // If we are leaving micro mode (expanding), we do that first so that the
      //     // text of the items in the navlist will be revealed by the animation.
      //     navigationList.setMicro(false);
      // }

      // Start this layout first since it does not require a layout
      refs.senchaLogo.animate({ dynamic: true, to: { width: new_width } });

      // Directly adjust the width config and then run the main wrap container layout
      // as the root layout (it and its chidren). This will cause the adjusted size to
      // be flushed to the element and animate to that new size.
      navigationList.width = new_width;
      wrapContainer.updateLayout({ isRoot: true });
      navigationList.el.addCls('nav-tree-animating');

      // We need to switch to micro mode on the navlist *after* the animation (this
      // allows the "sweep" to leave the item text in place until it is no longer
      // visible.
      if (collapsing) {
        navigationList.on({
          afterlayoutanimation: function() {
            navigationList.el.removeCls('nav-tree-animating');
          },
          single: true
        });
      }
      navigationList.setMicro(collapsing);
      btn.setIconCls(
        Ext.String.format('x-fa fa-angle-{0}', collapsing ? 'right' : 'left')
      );
    }
  },
  onResize: function() {
    var me = this,
      refs = me.getReferences(),
      navigationList = refs.navigationTreeList,
      wrapContainer = refs.mainContainerWrap,
      headerBar = refs.headerBar,
      lastWidth = navigationList.width || me.normalWidth;

    if (window.innerHeight == screen.height && !me.fullscreen) {
      // nomal to fullscreen toggle
      me.fullscreen = true;
      me.lastWidth = lastWidth;
      headerBar.hide();
      navigationList.width = 0;
      wrapContainer.updateLayout({ isRoot: true });
      navigationList.setMicro(true);
    } else if (window.innerHeight != screen.height && me.fullscreen) {
      // fullscreen to normal toggle
      me.fullscreen = false;
      headerBar.show();
      navigationList.width = me.lastWidth;
      wrapContainer.updateLayout({ isRoot: true });
      if (me.lastWidth === me.microWidth) {
        navigationList.setMicro(true);
      } else {
        navigationList.setMicro(false);
      }
    } else {
      // ignore resize events
    }
  },
  // handleChangeCombobox: async function(combobox, pk) {
  //   const response = await dht.ajax('/cluster/register', { pk });
  //   if (!response.success) {
  //     Ext.Msg.alert('오류', response.errMsg);
  //   } else {
  //     window.location.reload();
  //   }
  // }
});
