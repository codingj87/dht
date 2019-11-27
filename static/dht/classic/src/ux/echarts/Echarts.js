/**
 * Created by zen on 17. 2. 16. (copy by sejong on 18. 5. 10.)
 */
Ext.define('dhcp.ux.echarts.Echarts', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.echarts',
  requires: ['dhcp.ux.echarts.Theme', 'Ext.window.Toast'],
  config: {
    options: {},
    legend: null,
    promise: null,
    series: null,
    category: null,
    seriesData: null
  },

  initComponent: function() {
    var me = this;
    me.callParent();
  },

  listeners: {
    boxready: {
      scope: 'this',
      fn: 'initialize'
    },
    resize: {
      scope: 'this',
      fn: 'reSize'
    }
  },

  initialize: function() {
    var me = this;
    me.$chart = echarts.init(
      $(me.el.dom)
        .find('[data-ref="body"]')
        .get(0),
      me.theme || 'zen'
    );
    me.fireEvent('chartInitialize', me.$chart);
  },

  draw: function(options) {
    if (this.ticket) {
      clearTimeout(this.ticket);
    }
    this.ticket = Ext.Function.defer(
      function() {
        if (this.$chart) {
          this.$chart.setOption(options);
        }
      },
      50,
      this
    );
  },

  reSize: function() {
    if (this.$chart) this.$chart.resize();
  },

  applyOptions: function(params) {
    var theme = {};
    return Ext.apply(theme, params);
  },

  updateCategory: function(category) {
    if (!category) return;
    var options = this.getOptions();
    if (!options.xAxis) {
      options.xAxis = [{}];
    }
    Ext.Array.each(options.xAxis, function(xAxis) {
      Ext.apply(xAxis, category);
    });
    this.draw(options);
  },

  updateLegend: function(legend) {
    if (!legend) return;
    var options = this.getOptions();
    if (!options.legend) {
      options.lengend = {};
    }
    Ext.apply(options.legend, legend);
    this.draw(options);
  },

  updateChartData: function(data) {
    if (!data) return;
    var chart_options = this.getOptions();
    if (data.series) {
      chart_options.series = [];
      Ext.Array.each(data.series, function(item) {
        chart_options.series.push(item);
      });
    }
    if (data.legend && chart_options.legend) {
      chart_options.legend.data = data.legend;
    }
    if (data.splitNumber && chart_options.xAxis) {
      chart_options.xAxis[0].splitNumber = data.splitNumber;
    }
    this.draw(chart_options);
  },

  updateSeries: function(data) {
    if (!data) return;
    var chart_options = this.getOptions();
    var series = chart_options.series;
    if (series && series.length == data.length) {
      Ext.Array.each(series, function(item, index) {
        Ext.apply(item, data[index]);
      });
    } else {
      chart_options.series = [];
      Ext.Array.each(data, function(item) {
        chart_options.series.push(item);
      });
    }
    this.draw(chart_options);
  },

  updateSeriesData: function(data) {
    var me = this;
    var chart_options = this.getOptions();
    var defaultSeries = chart_options.defaultSeries;
    var series_list = chart_options.series || [];
    _.each(data, function(item, index) {
      if (item.id) {
        var series = _.findWhere(series_list, { id: item.id });
        if (series) {
          series.data = item.data;
        } else {
          if (defaultSeries) {
            series_list.push(Ext.merge(item, defaultSeries));
          }
        }
      } else {
        var series = _.findWhere(series_list, { name: item.name });
        if (series) {
          series.data = item.data;
        } else {
          if (defaultSeries) {
            series_list.push(Ext.merge(item, defaultSeries));
          }
        }
      }
    });
    chart_options.series = series_list;
    if (this.$chart) {
      this.$chart.setOption(chart_options);
    }
  },

  updatePromise: function(p) {
    var me = this;
    me.mask('loading...');
    if (p.always) {
      p.always(function() {
        me.unmask();
      }).otherwise(function(err) {
        me.mask();
        Ext.toast({
          anchor: me,
          html: err.toString(),
          animate: false,
          align: 'b'
        });
      });
    } else {
      p.then(
        function() {
          me.unmask();
        },
        function(err) {
          me.unmask();
          me.mask();
          Ext.toast({
            anchor: me,
            html: err.toString(),
            animate: false,
            align: 'b'
          });
        }
      );
    }
  },

  action: function(obj) {
    if (this.$chart) {
      this.$chart.dispatchAction(obj);
    }
  }
});
