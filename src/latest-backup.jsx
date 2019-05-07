import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import _ from "lodash";
import echart from "echarts";
import { Grid, Header, Icon, Image, Menu, Segment, Sidebar, Input, Button, Dropdown, Divider } from 'semantic-ui-react'
import CandleStick from './icons/candlestick.svg';
import Gantt from './icons/gantt.svg';
import Scatter from './icons/scatter.svg';
import Treemap from './icons/treemap.svg';
import DataSources from './chart-datasources';
import { getWidgetList } from "../../actions/widgetListingActions";
import { configParser } from "../../elements/configParser/configParser";
import "./styles.css";

let chartTypes = ['line', 'bar', 'scatter', 'pie', 'radar', 'candlestick', 'effectScatter', 'gauge', 'funnel', 'tree', 'treemap', 'sunburst', 'boxplot', 'map', 'heatmap', 'lines', 'parallel', 'sankey', 'themeRiver', 'pictorialBar', 'custom']

let chartSubTypes = {
  'line': ['line-simple', 'area-stack', 'line-step'],
  'bar': ['bar-y-category-stack'],
  'pie': ['pie-custom', 'calendar-pie'],
  'scatter': ['bubble-gradient', 'scatter-clustering-process', 'scatter-single-axis'],
  'candlestick': ['candlestick-simple', 'candlestick-large'],
  'treemap': ['treemap-simple'],
  'custom': ['custom-gantt-flight']
}


function configurator(chartSubType, options, setOptions, chartInitialization, stackName, xAxisDimension) {

  let createLineConfig = (dataset) => {
    console.log('datasett', dataset)
    let seriesConfig = []
    if (!!dataset) {
      for (let i = 0; i < dataset.dimensions.length - 1; i++) {
        seriesConfig.push({
          type: 'line'
        })
      }
      return seriesConfig;
    }
    // return dataset.dimensions.map(data => {
    //   return {
    //     type: 'line'
    //   }
    // });
    return options.series;
  }

  let createAreaStackConfig = (dataset) => {
    // let seriesConfig = []
    if (!!dataset)
      // {
      //   for (let i = 0; i < dataset.dimensions.length - 1; i++) {
      //     seriesConfig.push({
      //       name: dataset.dimensions[i],
      //       type: 'line',
      //       stack: stackName || 'Area Chart',
      //       areaStyle: {},
      //     })
      //   }
      //   return seriesConfig;
      // }
      return dataset.dimensions.map(data => {
        if (data !== xAxisDimension)  //todo: check why its not working, skipping xaxis dimension
          return {
            name: data,
            type: 'line',
            stack: stackName || 'Area Chart',
            areaStyle: {},
          }
      });
    return options.series;
  }

  let createLineStepConfig = (dataset) => {
    if (!!dataset)
      return dataset.dimensions.map(data => {
        if (data !== xAxisDimension)
          return {
            type: 'line',
            step: true,
          }
      });
    return options.series;
  }

  let createBarYStackConfig = (dataset) => {
    if (!!dataset) {
      let barOptions = {
        ...options,
        // dataZoom: [{}],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
        },
        series: dataset.dimensions.map(data => {
          if (data !== xAxisDimension)
            return {
              type: 'bar',
              stack: stackName,
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
            }
        })
      }
      return barOptions
    }
    return options;
  }

  let createPieCustomConfig = (dataset, pieDimension) => {
    if (!!dataset)
      return {
        ...options,
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: {
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            // data: data.legendData,
            selected: dataset.source.map(dat => {
              return {
                [dat[pieDimension]]: false
              }
            })
          },
          // itemStyle: {
          //     normal: {
          //         color: '#c23531',
          //         shadowBlur: 200,
          //         shadowColor: 'rgba(0, 0, 0, 0.5)'
          //     }
          // },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      };
  }

  let createBubbleScatterChart = (dataset) => {
    return {
      ...options,
      legend: {

      },
      xAxis: {

      },
      yAxis: {
        scale: true
      },
      series: dataset.dimensions.map(dat => {
        let randomValue = () => Math.floor(Math.random() * (255 - 0 + 1)) + 0;
        let color = `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
        // let shadow
        return {
          type: 'scatter',
          symbolSize: function (data) {
            return Math.sqrt(data[2]) / 5e2;
          },
          label: {
            emphasis: {
              show: true,
              formatter: function (param) {
                return param.data[3];
              },
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              shadowBlur: 10,
              // shadowColor: 'rgba(25, 100, 150, 0.5)',
              shadowOffsetY: 5,
              color: new echart.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: color
              }, {
                offset: 1,
                color: color
              }])
            }
          }
        }
      })
    };
  }

  let createCandlestickSimpleConfig = (dataset) => {
    if (!!dataset)
      return {
        ...options,
        // yAxis: {},
        // xAxis: {},
        xAxis: {
          type: "time",
          scale: true
        },
        yAxis: {
          type: "value",
          scale: true,
          boundaryGap: ['5%', '5%']
        },
        series: [{
          type: "candlestick",
          encode: {
            x: 'date',
            // y: ['product', '2015', '2016', '2017'],
            // tooltip: ["open", "high", "low", "close"]
          }
        }]
      };
    return options
  }

  let newSeries = options.series;
  let newOptions = options;
  let pieDimension = null;

  switch (chartSubType) {
    case 'line-simple':
      newSeries = createLineConfig(options.dataset);
      console.log('lineeee', newSeries)
      // setOptions(null, ['series'], newLineSeries);
      break;
    case 'area-stack':
      console.log('lineeee areaa')
      newSeries = createAreaStackConfig(options.dataset);
      // setOptions(null, ['series'], newLineAreaSeries);
      break;
    case 'line-step':
      console.log('lineeee stepp')
      newSeries = createLineStepConfig(options.dataset);
      break;
    case 'bar-y-category-stack':
      newOptions = createBarYStackConfig(options.dataset)
      break;
    case 'pie-custom':
      pieDimension = !!this.state.dataInfo ? this.state.dataInfo.find(dat => dat.type === 'STRING')['name'] : null;
      newOptions = createPieCustomConfig(options.dataset, pieDimension);
      break;
    case 'bubble-gradient':
      newOptions = createBubbleScatterChart(options.dataset);
      break;
    case 'candlestick-simple':
      newOptions = createCandlestickSimpleConfig(options.dataset);
      break;
    default:
      let seriesValue = []
      for (let i = 0; i < this.state.options.dataset['dimensions'].length; i++) {
        seriesValue = [...seriesValue, { type: this.state.chartType }]
      }
      this.setOptions(null, ['series'], seriesValue)
    // return;
    // console.log('DOING NOTHING IS BETTER THAN DOING SENSELESS')
  }

  this.setState({
    chartSubType
  }, () => {

    switch (this.state.chartType) {
      case 'line':
        setOptions(null, ['series'], newSeries);
        break;
      case 'bar':
        this.setState({
          options: newOptions,
          orientation: 'vertical'
        })
      case 'pie':
        this.setState({
          options: newOptions,
          orientation: 'horizontal',
          pieDimension: pieDimension
        })
        break;
      case 'scatter':
        this.setState({
          options: newOptions,
          orientation: 'horizontal'
        })
      case 'candlestick':
        this.setState({
          options: newOptions
        }, () => {
          console.log('state', this.state)
        })
    }
    chartInitialization(options.dataset);
  })

}

let chartIcons = {
  'line': <Icon name='chart line' size='huge' fitted />,
  'bar': <Icon name='chart bar' size='huge' />,
  'pie': <Icon name='chart pie' size='huge' />,
  'scatter': <img src={Scatter} className="App-logo" alt="logo" />,
  'candlestick': <img src={CandleStick} className="App-logo" alt="logo" />,
  'treemap': <img src={Treemap} className="App-logo" alt="logo" />,
  'custom': <img src={Gantt} className="App-logo" alt="logo" />,
}

// to be removed
let dummyDataset = {
  //   "options": {
  //     xAxis: {
  //         type: "category",
  //         scale: true
  //     },
  //     yAxis: {
  //         type: "value",
  //         scale: true,
  //         boundaryGap: ['5%', '5%']
  //     },
  //     dataset: {
  //         // dimensions: ,
  //         source: [["date","open","high","low","close","volume","haOpen","haHigh","haLow","haClose","sma9"],
  //             ["2018-01-09 14:30:00",14636.21,14682.6,14401.0,14659.57,349.069176,14647.89,14682.6,14401.0,14594.845,0.0],
  //             ["2018-01-09 15:00:00",14650.0,14700.0,14238.99,14347.43,459.735215,14621.3675,14700.0,14238.99,14484.105,0.0],
  //             ["2018-01-09 15:30:00",14374.72,14434.2,14011.05,14041.03,697.055035,14552.73625,14552.73625,14011.05,14215.25,0.0],
  //             ["2018-01-09 16:00:00",14072.87,14497.06,14064.13,14349.0,671.165463,14383.993125,14497.06,14064.13,14245.765,0.0],
  //             ["2018-01-09 16:30:00",14369.98,14640.99,14340.0,14560.48,416.750768,14314.8790625,14640.99,14314.8790625,14477.8625,0.0],
  //             ["2018-01-09 17:00:00",14551.42,14800.0,14551.41,14749.55,357.445717,14396.37078125,14800.0,14396.37078125,14663.095000000001,0.0],
  //             ["2018-01-09 17:30:00",14745.0,14766.2,14485.0,14654.96,306.727704,14529.732890625,14766.2,14485.0,14662.789999999999,0.0],
  //             ["2018-01-09 18:00:00",14655.01,14829.0,14585.01,14800.1,194.858965,14596.261445312499,14829.0,14585.01,14717.28,0.0],
  //             ["2018-01-09 18:30:00",14800.1,14998.62,14792.03,14951.01,313.268531,14656.770722656249,14998.62,14656.770722656249,14885.44,0.0],
  //             ["2018-01-09 19:00:00",14968.0,14982.0,14778.47,14810.0,214.504459,14771.105361328126,14982.0,14771.105361328126,14884.6175,16213.681111111111],
  //             ["2018-01-09 19:30:00",14810.0,14973.49,14799.95,14949.98,144.830078,14827.861430664063,14973.49,14799.95,14883.355,16245.94888888889],
  //             ["2018-01-09 20:00:00",14949.98,14990.0,14865.49,14916.91,145.574797,14855.608215332031,14990.0,14855.608215332031,14930.595000000001,16309.224444444444],
  //             ["2018-01-09 20:30:00",14914.03,14945.01,14799.01,14803.44,146.21296,14893.101607666016,14945.01,14799.01,14865.372500000001,16393.936666666665],
  //             ["2018-01-09 21:00:00",14803.46,14863.93,14700.44,14799.0,190.167582,14879.237053833009,14879.237053833009,14700.44,14791.7075,16443.936666666665],
  //             ["2018-01-09 21:30:00",14798.99,14798.99,14650.0,14717.82,209.543776,14835.472276916506,14835.472276916506,14650.0,14741.449999999999,16461.41888888889],
  //             ["2018-01-09 22:00:00",14717.82,14781.56,14600.0,14615.9,164.859485,14788.461138458253,14788.461138458253,14600.0,14678.82,16446.568888888887],
  //             ["2018-01-09 22:30:00",14647.09,14861.56,14615.4,14755.03,228.445843,14733.640569229126,14861.56,14615.4,14719.77,16457.687777777777],
  //             ["2018-01-09 23:00:00",14755.33,14780.0,14680.0,14702.33,150.779654,14726.705284614563,14780.0,14680.0,14729.415,16446.824444444443],
  //             ["2018-01-09 23:30:00",14709.49,14709.49,14420.0,14462.81,274.752199,14728.060142307282,14728.060142307282,14420.0,14575.447499999998,16392.579999999998],
  //             ["2018-01-10 00:00:00",14452.0,14536.36,14407.77,14435.0,279.156552,14651.753821153641,14651.753821153641,14407.77,14457.782500000001,16350.913333333334],
  //             ["2018-01-10 00:30:00",14435.0,14459.94,14182.84,14254.92,435.050575,14554.768160576821,14554.768160576821,14182.84,14333.175,16273.684444444445],
  //             ["2018-01-10 01:00:00",14234.7,14290.56,14125.0,14259.98,422.926221,14443.97158028841,14443.97158028841,14125.0,14227.560000000001,16200.692222222224],
  //             ["2018-01-10 01:30:00",14259.98,14454.95,14144.13,14400.0,377.788542,14335.765790144205,14454.95,14144.13,14314.765,16155.865555555552],
  //             ["2018-01-10 02:00:00",14401.0,14480.0,13750.0,13972.46,582.921859,14325.265395072103,14480.0,13750.0,14150.865,16064.027777777777]
  //         ]
  //     },
  //     series: [{
  //         type: "candlestick",
  //         encode: {
  //             x: "date",
  //             y: ["open", "close", "low", "high"],
  //             tooltip: ["open", "high", "low", "close"]
  //         }
  //     }]
  // }
  "options": {
    legend: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    dataset: {
      // Here the declared `dimensions` is mainly for providing the order of
      // the dimensions, which enables ECharts to apply the default mapping
      // from dimensions to axes.
      // Alternatively, we can declare `series.encode` to specify the mapping,
      // which will be introduced later.
      dimensions: ['product', '2015', '2016', '2017', 'date'],
      source: [
        { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7, 'date': '2018-01-09 14:30:00' },
        { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1, 'date': '2018-01-09 20:50:00' },
        { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5, 'date': '2018-01-09 18:10:00' },
        { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1, 'date': '2018-01-09 19:35:00' }
      ]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [
      { type: 'line' },
      { type: 'line' },
      { type: 'line' }
    ],
    dataZoom: [{ type: 'inside' }, { type: 'slider' }]
  }
}
class ChartCreator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPoint: 0,
      types: [],
      options: {},
      chartType: chartTypes[0],
      orientation: 'horizontal',
      chartSubType: 'line-simple',
      simpleControls: true,
      leftSidebar: 'controls',       // toggle between controls and options
      xAxisDimension: '',
      yAxisDimension: '',
      pieDimension: null,
      candlestickYEncoding: ["", "", "", ""], // [open, close, high, low]
      candlestickXEncoding: null, // xaxis dimension
      canRenderChart: false,
      dimensions: []
    };
    this.configurator = configurator.bind(this);
  }
  // "Object", "string", "boolean", "*", "Color", "number", "Array", "Function"
  componentDidMount() {
    let replacer = (key, value) => {
      // Filtering out properties
      if (key === "description") {
        return undefined;
      }
      return value;
    };

    let me = this;
    fetch(
      "https://raw.githubusercontent.com/ecomfe/echarts-www/master/documents/en/option_outline.json"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        // console.log(JSON.stringify(myJson, replacer));
        me.setState({
          data: JSON.parse(JSON.stringify(myJson, replacer))
        });
      });

    this.chartInitialization(dummyDataset);
    this.setState({
      dimensions: ['product', '2015', '2016', '2017', 'date']
    })
  }

  componentDidUpdate() {
    if (!this.state.canRenderChart)
      this.shouldRenderChart();
  }
  componentWillUnmount() {

  }
  chartInitialization = (dataset, theme = null) => {
    console.log('thmeeeee', theme, this.state, dataset)
    !!this.state.chart && this.state.chart.dispose();
    if (this.state.canRenderChart) {
      let chart = echart.init(document.getElementById("main"), !!theme ? theme : 'default');
      this.setState({
        chart
      }, () => {
        this.setState(dataset, () => {
          // this.setOptions("series", "type", "bar")
          this.state.chart.setOption(this.state.options)

        });
      });
    }
  }

  renderData = () => {
    if (this.state.data !== undefined) {
      let { data } = this.state;
      // let data = JSON.parse(this.state.data);
      return Object.keys(data.option.properties).map((dat, index) => {
        return (
          <div key={dat}>
            <Menu.Item as='a'
              style={{
                cursor: "pointer",
                marginBottom: "5px",
                fontWeight: index === this.state.currentPoint ? "bold" : "",
                fontSize: index === this.state.currentPoint && 20
              }}
              onClick={() => {
                this.setState({ currentPoint: index, leftSidebar: 'controls' });
              }}
            >
              {dat}
            </Menu.Item >
          </div>
        );
      });
      // return <div>{JSON.stringify(data.option.properties)}</div>
    }
  };

  handleInputChange = (event, parentPropertyName) => {
    let path = [];
    let findPath = (target) => {
      let target1 = target;
      // console.log('target2', target1)
      do {
        let dat = target1.getAttribute('data');
        // console.log('datt', parentPropertyName, dat)
        // todo: make a condition to not go beyond the last parent
        if (dat !== null) {
          path.unshift(dat);
        }
        target1 = target1.parentElement;
      }
      while (target1 !== null && !!target1.getAttribute('data') || target1.parentElement !== null)
    }

    // console.log('eventttt', event, parentPropertyName);
    const target = event.target;
    const propertyValue = target.type === "checkbox" ? target.checked : target.value;
    const propertyName = target.name;
    findPath(target)
    // console.log('targetpar', target.parentElement.parentElement.parentElement.parentElement);
    this.setOptions(parentPropertyName, path, propertyValue);
  };

  renderController = (
    type,
    name,
    defaultValue,
    properties,
    parentPropertyName
  ) => {
    // console.log('namme', parentPropertyName, name)
    let type1 = type[0]; // reconfigure this
    // let defaultValue =
    switch (type1) {
      case "Object":
      case "*":
        return (
          <div style={{ border: '1px solid grey' }}>
            {this.renderAdvancedControls(properties)}
          </div>);
      case "string":
        return (
          <Input
            type="text"
            className="ui input"
            name={name}
            id={name}
            required
            minLength="4"
            maxLength="70"
            size="20"
            defaultValue={defaultValue}
            size="mini"
            onChange={e => this.handleInputChange(e, parentPropertyName)}
          />
        );
      case "boolean":
        return (
          <Input
            type="checkbox"
            name={name}
            defaultValue={defaultValue}
            size="mini"
            onChange={e => this.handleInputChange(e, parentPropertyName)}
          />
        );
      case "Color":
        return (
          <Input
            type="color"
            name={name}
            defaultValue={defaultValue}
            size="mini"
            onChange={e => this.handleInputChange(e, parentPropertyName)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            name={name}
            min="0"
            step="10"
            defaultValue={defaultValue}
            size="mini"
            onChange={e => this.handleInputChange(e, parentPropertyName)}
          />
        );
      //todo fix array render
      case "Array":
        return (
          <Input
            type="text"
            name={name}
            id={name}
            required
            minLength="4"
            maxLength="8"
            size="mini"
            onChange={e => this.handleInputChange(e, parentPropertyName)}
          />
        );
      default:
        console.log("no type");
    }
  };

  addChartDom = () => {
    // { this.state.canRenderChart && <div id="main" style={{ background: 'white', marginLeft: '20px' }} /> }
    let main = document.createElement("div");
    main.setAttribute("id", "main");
    // main.style.width = "100px";
    // main.style.height = "100px";
    main.style.background = "white";
    main.style.marginLeft = "20px";

    document.getElementById("content").appendChild(main);

  }
  shouldRenderChart = async () => {
    if ((this.state.type === 'candlestick' && !!this.state.candlestickXEncoding && !!this.state.candlestickYEncoding.length && this.state.candlestickYEncoding.every(val => !!val)) || (!!this.state.xAxisDimension && !!this.state.yAxisDimension)) {
      await this.addChartDom();
      await this.setState({
        canRenderChart: true
      }, () => {
        let options = !!this.state.options.series ? this.state.options : dummyDataset;
        this.chartInitialization(options);

      })
    }
  }

  handleStackedConfig = (e) => {
    let series = this.state.options.series;
    const value = e.target.checked;

    console.log('value', value)
    if (value)
      series = series.map(dat => {
        return { ...dat, stack: 'Bar Stack' }
      })
    else
      series = series.map(dat => {
        return { ...dat, stack: null }
      })
    this.setOptions(null, ['series'], series);
  }

  setChartSubTypeConfig = (chartName, value) => {
    switch (chartName) {
      case 'line-step':
        if (this.state.options) {
          let newSeries = this.state.options.series.map(dat => {
            return {
              ...dat, step: value, type: 'line'
            };
          })
          this.setOptions(null, ['series'], newSeries)
        }
        break;
      default:
        console.log('I WONT TOUCH SH**');
    }
  }

  setChartOrientation = (orientation) => {
    this.setState({
      orientation
    }, () => {
      if (orientation === 'horizontal') {
        this.setOptions(null, ['xAxis', 'type'], 'category')
        this.setOptions(null, ['yAxis', 'type'], 'value')
      }
      else {
        this.setOptions(null, ['yAxis', 'type'], 'category')
        this.setOptions(null, ['xAxis', 'type'], 'value')
      }
    })
  }
  renderChartSpecificControls = (chartName) => {
    switch (chartName) {
      case 'line-step':
        console.log('stepppepepepe')
        return <div>
          <h3>Step type:</h3> &nbsp;
          <Dropdown
            placeholder='Select step type'
            selection
            style={{ width: '250px' }}
            defaultValue={'start'}
            onChange={(e, { value }) => this.setChartSubTypeConfig(chartName, value)}
            options={
              !!this.state.options && ['start', 'middle', 'end'].map(type => {
                return { key: type, value: String(type), text: type }
              })
            } />
        </div>
      case 'bar-y-category-stack':
        console.log('bar yy')
        return <div>
          <h3 style={{ display: 'inline-block' }}>Stacked</h3> &nbsp;
          <Input
            type="checkbox"
            name={'stacked'}
            // checked={true}
            size="large"
            onChange={this.handleStackedConfig}
          />
        </div>
      case 'pie-custom':
        return <div>
          <h3>Dimension</h3> &nbsp;
          <Dropdown
            placeholder='Select dimension'
            selection
            style={{ width: '250px' }}
            defaultValue={'start'}
            onChange={(e, { value }) => this.setState({ pieDimension: value })}
            options={
              !!this.state.dataInfo && this.state.dataInfo.filter(data => {
                return data.type === 'STRING' || data.type === 'String'
              }).map(type => {
                return { key: type.name, value: String(type.name), text: type.name }
              })
            } />
        </div>
      case 'candlestick-simple':
      case 'candlestick-large':
        return this.renderCandlestickSpecificControls();
      default:
        console.log('blehhh');
    }
  }

  setCandleStickConfig = (posn, value) => {
    this.setState({
      candlestickYEncoding: Object.assign([...this.state.candlestickYEncoding], { [posn]: value })
    }, () => {
      if (!!this.state.candlestickYEncoding.length && this.state.candlestickYEncoding.every(val => !!val))
        this.setOptions('series', ['encode', 'y'], this.state.candlestickYEncoding);
    })

  }

  renderCandlestickSpecificControls = () => {
    return (<div>
      <h3>Select Open: </h3> &nbsp;
            <Dropdown
        placeholder='Select Open'
        selection
        style={{ width: '250px' }}
        // defaultValue={this.state.candlestickYEncoding[0]}
        onChange={(e, { value }) => this.setCandleStickConfig(0, value)}
        options={
          !!this.state.candlestickYEncoding && this.state.dimensions.filter(dimension => {  // add condition for checking if dimesnion is number
            return !this.state.candlestickYEncoding.includes(dimension)
          }).map(dimension => {
            return { key: dimension, value: String(dimension), text: dimension }
          })
        } />
      <h3>Select Close: </h3> &nbsp;
            <Dropdown
        placeholder='Select Close'
        selection
        style={{ width: '250px' }}
        // defaultValue={this.state.candlestickYEncoding[1]}
        onChange={(e, { value }) => this.setCandleStickConfig(1, value)}
        options={
          !!this.state.candlestickYEncoding && this.state.dimensions.filter(dimension => {  // add condition for checking if dimesnion is number
            return !this.state.candlestickYEncoding.includes(dimension)
          }).map(dimension => {
            return { key: dimension, value: String(dimension), text: dimension }
          })
        } />
      <h3>Select Lowest: </h3> &nbsp;
          <Dropdown
        placeholder='Select lowest'
        selection
        style={{ width: '250px' }}
        // defaultValue={this.state.candlestickYEncoding[2]}
        onChange={(e, { value }) => this.setCandleStickConfig(2, value)}
        options={
          !!this.state.candlestickYEncoding && this.state.dimensions.filter(dimension => {  // add condition for checking if dimesnion is number
            return !this.state.candlestickYEncoding.includes(dimension)
          }).map(dimension => {
            return { key: dimension, value: String(dimension), text: dimension }
          })
        } />
      <h3>Select Highest: </h3> &nbsp;
          <Dropdown
        placeholder='Select Highest'
        selection
        style={{ width: '250px' }}
        // value={this.state.candlestickYEncoding[3]}
        onChange={(e, { value }) => this.setCandleStickConfig(3, value)}
        options={
          !!this.state.candlestickYEncoding && this.state.dimensions.filter(dimension => {  // add condition for checking if dimesnion is number
            return !this.state.candlestickYEncoding.includes(dimension)
          }).map(dimension => {
            return { key: dimension, value: String(dimension), text: dimension }
          })
        } />
    </div>)
  }
  renderSimpleControls = () => {
    return (
      <div>
        <div style={{ textAlign: 'left' }}>General</div>
        <h3>Title: </h3> &nbsp;
        <Input
          type="text"
          className="ui input"
          name={'title'}
          id={'title'}
          required
          minLength="4"
          maxLength="70"
          size="20"
          defaultValue=""
          size="small"
          onChange={e => {
            this.setOptions('title', ['text'], e.target.value)
          }}
        />
        {/* {this.renderController(
          ["string"],
          "text",
          "",
          undefined,
          "title"
        )} */}
        <h3>Color theme: </h3> &nbsp;
          <Dropdown
          placeholder='Select Theme'
          selection
          style={{ width: '250px' }}
          defaultValue={'default'}
          onChange={(e, { value }) => this.chartInitialization(this.state.options, value)}
          options={
            !!this.state.options && ['default', 'light', 'dark'].map(theme => {
              return { key: theme, value: String(theme), text: theme }
            })
          } />
        {/* <h3>Sort By: </h3> &nbsp; */}
        <h3>X-Axis: </h3> &nbsp;
        <Dropdown
          placeholder='Select Dimension'
          selection
          style={{ width: '250px', }}
          defaultValue={this.state.xAxisDimension}
          onChange={(event, { value }) => this.setState({ xAxisDimension: value }, () => { // because of
            this.setOptions(null, ['dataset', 'dimensions'], Array.from(new Set([this.state.xAxisDimension, ...this.state.dimensions])))

          })}
          options={
            !!this.state.dimensions.length && _.map(this.state.dimensions.filter(dat => dat !== this.state.yAxisDimension), (key) =>
              ({ key: key, value: String(key), text: key }))} />
        <h3>Y-Axis: </h3> &nbsp;
        <Dropdown
          placeholder='Select Dimension'
          selection
          style={{ width: '250px' }}
          defaultValue={this.state.yAxisDimension}
          onChange={(event, { value }) => this.setState({ yAxisDimension: value }, () => {
            // this.setOptions(null, ['dataset', 'dimensions'], Array.from(new Set([this.state.yAxisDimension, ...this.state.options.dataset.dimensions])))
          })}
          options={
            !!this.state.dimensions.length && _.map(this.state.dimensions.filter(dat => dat !== this.state.xAxisDimension), (key) =>
              ({ key: key, value: String(key), text: key }))} />
        <h3>Orientation: </h3> &nbsp;
        <Dropdown
          placeholder='Select Orientation'
          selection
          style={{ width: '250px' }}
          value={this.state.orientation}
          onChange={(e, { value }) => this.setChartOrientation(value)}
          options={
            !!this.state.options && ['horizontal', 'vertical'].map(type => {
              return { key: type, value: String(type), text: type }
            })
          } />
        <Divider />
        <div style={{ textAlign: 'left' }}>Chart specific</div>
        {this.renderChartSpecificControls(this.state.chartSubType)}
      </div>
    )
  }

  renderAdvancedControls = (properties = null) => {
    if (this.state.data !== undefined) {
      let { data } = this.state;
      // let data = JSON.parse(this.state.data);

      let pointKeys = Object.keys(data.option.properties);
      let point = Object.values(data.option.properties)[
        this.state.currentPoint
      ];
      // console.log('propertiess', properties);
      let properties1 = !!properties
        ? Object.keys(properties)
        : Object.keys(point.properties)

      return properties1.map((dat, index) => {
        // console.log("dat", dat);
        let propertyValue = !!properties ? properties[dat] : point.properties[dat];
        // console.log("prope", propertyValue);
        return (
          <div key={dat} data={dat} style={{ marginBottom: "10px" }}>
            {dat}&nbsp;&nbsp;
            {this.renderController(
              propertyValue.type,
              dat,
              propertyValue.default,
              propertyValue.properties,
              pointKeys[this.state.currentPoint]
            )}
          </div>
        );
      });
    }
    return null;
  };

  setOptions = (parentPropertyName, propertyPath, propertyValue) => {
    console.log('pathhy', propertyPath)
    // let parent = this.state.options[parentPropertyName];
    // let data = JSON.parse(this.state.data);
    // reconfigure this
    // let findKey = (parentPropName, propName) => {
    //   return _.findKey(data, function(obj){
    //     // console.log('objj', obj);
    //     if(!!obj){
    //       console.log(obj, '---objjjj')
    //       //todo: code here
    //     }
    //     return _.has(obj.parentPropertyName, propertyName)
    //   })
    // }

    // let findPath = () => {
    //   let toFindPath = [];
    //   key = findKey(parentPropertyName, propertyName)
    //   while(key !== null || key !== null){
    //     toFindPath.push(key)
    //   }
    //   return toFindPath;
    // }

    let path = (parentPropertyName !== null) ? [parentPropertyName, ...propertyPath] : [...propertyPath];
    // console.log('pat')
    this.setState(
      {
        options: _.set(
          this.state.options,
          path,
          propertyValue
        )
      },
      () => {
        if (this.state.chart) {
          // console.log(this.state.options);
          this.state.chart.setOption(this.state.options);
        }
      }
    );
  };

  handleChartTypeChange = (value) => {
    // let value = e.target.value;
    this.setState({
      chartType: value,
      chartSubType: chartSubTypes[value][0]
    }, () => {
      let { chart } = this.state;
      if (chart !== undefined) {
        this.configurator(chartSubTypes[value][0], this.state.options, this.setOptions, this.chartInitialization, 'some chart', this.state.xAxisDimension)
        // let seriesValue = []
        // for (let i = 0; i < this.state.options.dataset['dimensions'].length; i++) {
        //   seriesValue = [...seriesValue, { type: value }]
        // }
        // this.setOptions(null, ['series'], seriesValue)
      }
    })
  };

  setChartTypes = () => {

    return (
      <Grid style={{ marginLeft: '380px', marginBottom: '30px', height: '100px' }}>
        {/* <h3 style={{ display: 'inline' }}>Chart types &nbsp;</h3> */}
        {
          Object.keys(chartIcons).map(iconKey => {
            return <Grid.Column key={iconKey} style={{ height: '80px', marginRight: '20px', cursor: 'pointer' }} onClick={() => this.handleChartTypeChange(iconKey)} >{chartIcons[iconKey]}<label>{iconKey}</label></Grid.Column>
          })
        }
        {/* <select value={this.state.chartType} onChange={this.handleChartTypeChange}>
          {
            chartTypes.map(chartType => {
              return <option key={chartType} value={chartType}>{chartType}</option>
            })
          }
        </select> */}
        {/* <span> {this.state.simpleControls ? <button onClick={() => this.setState({ simpleControls: false })}>Advanced Settings &#8646;</button> : <button onClick={() => this.setState({ simpleControls: true })}>Simple Settings &#8646;</button>}</span> */}

      </Grid>
    );
  }

  setChartDataSet = (dataset) => {
    // console.log('settinggg', dataset, this.state.options)
    this.setState({
      options: {
        ...this.state.options,
        dataset: {
          dimensions: dataset.attributes.map(dat => {
            return dat.name
          }),
          source: dataset.data
        },
        series: dataset.attributes.map(dat => {
          return { type: this.state.chartType }
        })
      },

    }, () => {
      this.chartInitialization(this.state.options.dataset)
    });

  }

  setDataSource = (widgetConfig) => {
    let config = new configParser(widgetConfig._id);
    config.getWidget().then(res => {
      // console.log('ress', res)
      this.setState({ loading: true });
      res.getData().then(data => {
        if (data)
          this.setState({ config: res, dataInfo: data.attributes, loading: false }, () => {
            this.setChartDataSet(data);
          });

        else
          this.setState({ loading: false });
      });
      //todo: 25 march setting dataset for chart
    }).catch(e => {
      alert('error while setting datasource', e)
    });
  }

  render() {
    console.log('seeleted', this.state.candlestickYEncoding[2])
    // console.log('optionss', this.state.data)
    return (
      <div className="chart-creator" >
        <Sidebar.Pushable as={Segment} style={{ background: '#333', color: 'white', overflowY: 'hidden' }}>
          {/* {!this.state.simpleControls && */}
          <Sidebar as={Menu} animation='push' icon='labeled' inverted vertical visible width='wide'>
            {!this.state.simpleControls && this.state.leftSidebar === 'options' && <div>{this.renderData()}</div>}
            {this.state.simpleControls && <div>{this.renderSimpleControls()}</div>}
          </Sidebar>
          {!this.state.simpleControls && this.state.leftSidebar === 'controls' && <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            vertical
            visible
            width='wide'
          >
            {this.state.data !== undefined
              && <div onClick={() => { this.setState({ leftSidebar: 'options' }) }} style={{ cursor: 'pointer', borderBottom: '1px solid white', padding: '5px 10px 5px 10px', marginBottom: '5px', textTransform: 'uppercase', textAlign: 'left' }}><Icon size="large" name="arrow left" />{Object.keys(this.state.data.option.properties)[this.state.currentPoint]} </div>
            }
            <div>{this.renderAdvancedControls()}</div>
          </Sidebar>
          }
          {/* } */}
          <h1>
            <div className="ui labeled tiny button" tabIndex="0">
              <div className={`ui tiny button ${this.state.simpleControls ? 'yellow' : ''}`} onClick={() => this.setState({ simpleControls: true })}>
                Simple Settings
              </div>
              <a className={`ui left pointing label ${!this.state.simpleControls ? 'yellow' : ''}`} onClick={() => this.setState({ simpleControls: false })}>
                Advanced Settings
              </a>
            </div>
            <DataSources widgetList={this.props.widgetList} getWidgetList={this.props.getWidgetList} setDataSource={this.setDataSource} />
          </h1>
          {this.setChartTypes()}
          <Sidebar.Pusher >
            <div className="chart-pusher">
              <div
                id="content"
                style={{
                  // display: "grid",
                  // gridTemplateColumns: "350px auto",
                  // justifyItems: "stretch",
                  background: '#333', color: 'white'
                }}
              // style={{ background: '#32174D', color: 'white' }}
              >
                {!this.state.canRenderChart && <div style={{ textAlign: 'left' }}>Requirements are not fulfilled to render the chart. Select all remaining fields to render the chart. </div>}
              </div>
            </div>
          </Sidebar.Pusher>
          <Sidebar as={Menu} animation='push' direction='right' icon='labeled' inverted vertical visible width='thin'>
            {chartSubTypes[this.state.chartType].map(dat => <Menu.Item key={dat} onClick={() => { this.configurator(dat, this.state.options, this.setOptions, this.chartInitialization, 'some chart', this.state.xAxisDimension) }} ><div data-tooltip={dat} data-position="bottom left"><Image src={`https://raw.githubusercontent.com/ecomfe/echarts-examples/gh-pages/public/data/thumb/${dat}.png`} /></div></Menu.Item>
            )}
          </Sidebar>
        </Sidebar.Pushable>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    widgetList: state.widgetList.widgets
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWidgetList: () => {
      dispatch(getWidgetList());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartCreator);


//todo: appy max points limit alert
// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

// max render size
// const MAXIMUM_RENDER_SIZE = {
//   line: 25000,
//   area: 25000,
//   scatter: 100000,
//   bubble: 25000,
//   column: 25000,
//   treemap: 2500,
//   sunburst: 1000,
//   heatmap: 20000
// };