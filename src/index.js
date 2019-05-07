import React from "react";
import ReactDOM from "react-dom";
// import { connect } from 'react-redux';
import _ from "lodash";
import echart from "echarts";
import { Grid, Header, Icon, Image, Menu, Segment, Sidebar, Input, Button, Dropdown, Divider, Modal } from 'semantic-ui-react'
import CandleStick from './icons/candlestick';
import Gantt from './icons/gantt';
import Scatter from './icons/scatter';
import Treemap from './icons/treemap';
import Bar from './icons/bar-chart';
import Line from './icons/line-chart';
import Pie from './icons/pie-chart';
import XLSX from 'xlsx';
// import GanttChart from "./gantt";
import "./styles.css";

let MAX_LENGTH_SINGLEAXIS = 1000;
let chartTypes = ['line', 'bar', 'scatter', 'pie', 'radar', 'candlestick', 'effectScatter', 'gauge', 'funnel', 'tree', 'treemap', 'sunburst', 'boxplot', 'map', 'heatmap', 'lines', 'parallel', 'sankey', 'themeRiver', 'pictorialBar', 'custom']

let chartSubTypes = {
  'line': ['line-simple', 'area-stack', 'line-step'],
  'bar': ['bar-y-category-stack'],
  'pie': ['pie-custom', 'calendar-pie'],
  'scatter': ['bubble-gradient', 'scatter-single-axis'], //'scatter-clustering-process'
  'candlestick': ['candlestick-simple', 'candlestick-large'],
  'treemap': ['treemap-simple'],
  'heatmap': ['calendar-heatmap'],
  'custom': ['custom-gantt-flight']
}

let axisFields = {
  x: {
    'multiple': ['bar-y-category-stack',],
    'single': ['line-simple', 'area-stack', 'line-step', 'bubble-gradient', 'candlestick-simple', 'candlestick-large'],
    'none': ['treemap-simple', 'pie-custom', 'calendar-pie', 'scatter-single-axis', 'custom-gantt-flight']
  },
  y: {
    'multiple': ['line-simple', 'area-stack', 'line-step', 'bubble-gradient'],
    'single': [],
    'none': ['treemap-simple', 'pie-custom', 'bar-y-category-stack', 'calendar-pie', 'candlestick-simple', 'candlestick-large', 'scatter-single-axis', 'custom-gantt-flight']
  }
}


function configurator(chartSubType, options, setOptions, chartInitialization, stackName, xAxisDimension) {
  let createLineConfig = (dataset) => {
    if (!!dataset) {
      return [{
        type: 'line',
        //  smooth: true 
      }]
    }
    return options.series;
  }

  let createAreaStackConfig = (dataset) => {

    if (!!dataset)

      return [{
        type: 'line',
        stack: stackName || 'Area Chart',
        areaStyle: {},
        // smooth: true 
      }];
    return options.series;
  }

  let createLineStepConfig = (dataset) => {
    if (!!dataset)
      return [{
        type: 'line',
        step: true,
      }]
    return options.series;
  }

  let createBarYStackConfig = (dataset) => {
    if (!!dataset) {
      let barOptions = {
        ...options,
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        dataZoom: [],
        series:
          [{
            type: 'bar',
            stack: 'stackName',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
          }]
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
        },
        series: {
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(0,0,0, 0.5)'
              }
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
          },

          itemStyle: {
            normal: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return 200;
          }
        }
      };
  }

  let createBubbleScatterChart = (dataset) => {
    return {
      ...options,
      legend: {
        type: 'plain',
        right: 10,
        orient: 'vertical',
        data: []
      },
      dataZoom: [{ type: 'inside' }, { type: 'slider' }],
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'value',
        scale: true
      },
      series: [
        // dataset.dimensions.map(dat => {
        (() => {
          let randomValue = () => Math.floor(Math.random() * (255 - 0 + 1)) + 0;
          let color = `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
          // let shadow
          return {
            type: 'scatter',
            symbolSize: (data) => {
              return 50;
            },
            label: {
              emphasis: {
                show: true,
                formatter: function (param) {
                  return param.data[param.seriesName];
                },
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.4)',
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
        })()
      ]
      // })
    };
  }

  let createCandlestickSimpleConfig = (dataset) => {
    if (!!dataset)
      return {
        ...options,
        dataZoom: [{ type: 'inside' }, { type: 'slider' }],
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
          }
        }]
      };
    return options
  }

  let createSingleAxisScatter = (dataset) => {
    if (!!dataset) {
      return {
        dataset,
        tooltip: {
          position: 'top'
        },
        title: [],
        singleAxis: [],
        series: []
      }
    }
  }

  let createLineOptions = (series) => {
    return {
      dataset: options.dataset,
      dataZoom: [{ type: 'inside' }, { type: 'slider' }],
      xAxis: [
        {
          type: 'category',
        }
      ],
      yAxis: [
        {
          type: 'value',
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        type: 'plain',
        right: 10,
        orient: 'vertical',
        data: []
      },
      grid: {
        left: '3%',
        right: '4%',
        // bottom: '3%',
        containLabel: true
      },
      series
    }
  }

  // let createCustomGantt = (dataset) => {

  // }

  let newSeries = options.series;
  let newOptions = options;
  let pieDimension = null;

  switch (chartSubType) {
    case 'line-simple':
      newSeries = createLineConfig(options.dataset);
      break;
    case 'area-stack':
      newSeries = createAreaStackConfig(options.dataset);
      break;
    case 'line-step':
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
    case 'scatter-single-axis':
      newOptions = createSingleAxisScatter(options.dataset)
      break;
    case 'candlestick-simple':
    case 'candlestick-large':
      newOptions = createCandlestickSimpleConfig(options.dataset);
      break;
    default:
      let seriesValue = []
      for (let i = 0; i < this.state.options.dataset['dimensions'].length; i++) {
        seriesValue = [...seriesValue, { type: this.state.chartType }]
      }
      this.setOptions(null, ['series'], seriesValue)
  }

  this.setState({
    chartSubType
  }, () => {

    switch (this.state.chartType) {
      case 'line':
        let lineOptions = createLineOptions(newSeries)
        this.setState({
          options: lineOptions,
          orientation: 'horizontal'
        })
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
          options: newOptions,
          orientation: 'horizontal'
        }, () => {
        })
    }
    this.state.chartSubType !== 'custom-gantt-flight' && chartInitialization("main", options.dataset);
  })

}

let chartIcons = {
  'line': (props) => <Line {...props} />,
  'bar': (props) => <Bar  {...props} />,
  'pie': (props) => <Pie  {...props} />,
  'scatter': (props) => <Scatter {...props} />,
  'candlestick': (props) => <CandleStick {...props} />,
  // 'treemap': (props) => <Treemap {...props} />,
  'custom': (props) => <Gantt {...props} />,
}

let initialState = {
  currentPoint: 0,
  types: [],
  options: {},
  chartType: chartTypes[0],
  orientation: 'horizontal',
  chartSubType: 'line-simple',
  simpleControls: true,
  leftSidebar: 'controls',       // toggle between controls and options
  xAxisDimension: '',
  yAxisDimension: [''],
  multiplexAxisDimension: [''],
  pieDimension: null,
  candlestickYEncoding: [], // [open, close, high, low]
  candlestickXEncoding: null, // xaxis dimension
  singleAxisDataset: null,
  error: null,
  gantDataSource: '',
  gantViewMode: 'Quarter Day',
  gantDimensions: {},
  barStacked: true,
}
class ChartCreator extends React.Component {

  constructor(props) {
    super(props);
    console.log('propss', this.props)
    this.state = initialState;
    this.containerRef = React.createRef();
    this.fileInput = React.createRef();
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
        me.setState({
          data: JSON.parse(JSON.stringify(myJson, replacer))
        });
      });
  }

  componentWillUnmount() {
    this.chartDeInitialization();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.fatalError === true && this.props.fatalError === false) {
      this.setState({
        ...this.state, initialState
      })
    }
  }

  chartInitialization = (elementId, dataset, theme = null) => {
    !!this.state.chart && this.state.chart.dispose();
    let chart = echart.init(document.getElementById(elementId), !!this.state.theme ? this.state.theme : 'default');
    this.setState({
      chart
    }, () => {
      this.setState(dataset, () => {
        this.state.chart.setOption(this.state.options)
      });
    });
  }

  initializeOnGanttUnmount = () => {
    this.chartInitialization('main', this.state.options.dataset);
  }

  chartDeInitialization = async () => {
    this.state.chart.dispose()
    return true;
  }

  setError = (error) => {
    this.setState({
      error
    })
  }

  iconColor = (active, theme) => {
    if (active && theme === 'dark') {
      return '#fbbd08'
    }
    else if (active && theme === 'white') {
      return 'light grey';
    }
    else if (theme === 'dark') {
      return 'white'
    }
    else {
      return 'dark grey'
    }
  }

  handleFileSubmit = (event) => {
    event.preventDefault();
    var reader = new FileReader();
    let me = this
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });
      workbook.SheetNames.forEach(function (sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        me.setState({
          dataInfo: _.map(XL_row_object[0], (val, key) => { return { name: key, type: (typeof val).toUpperCase() } })
        }, () => me.setChartDataSet({
          dimensions: Object.keys(XL_row_object[0]),
          source: XL_row_object
        })
        )
      })
      reader.onerror = function (ex) {
        alert(ex);
      };
    };
    reader.readAsArrayBuffer(this.fileInput.current.files[0]);
  }

  renderData = () => {
    if (this.state.data !== undefined) {
      let { data } = this.state;
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
    }
  };

  handleInputChange = (event, parentPropertyName) => {
    let path = [];
    let findPath = (target) => {
      let target1 = target;
      do {
        let dat = target1.getAttribute('data');
        // todo: make a condition to not go beyond the last parent
        if (dat !== null) {
          path.unshift(dat);
        }
        target1 = target1.parentElement;
      }
      while (target1 !== null && !!target1.getAttribute('data') || target1.parentElement !== null)
    }

    const target = event.target;
    const propertyValue = target.type === "checkbox" ? target.checked : target.value;
    const propertyName = target.name;
    findPath(target)

    this.setOptions(parentPropertyName, path, propertyValue);
  };

  renderController = (
    type,
    name,
    defaultValue,
    properties,
    parentPropertyName
  ) => {
    let type1 = type[0]; // reconfigure this    
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
        console.log("Has no type?");
    }
  };

  handleStackedConfig = (e) => {
    let series = this.state.options.series;
    const value = e.target.checked;

    if (value)
      series = series.map(dat => {
        return { ...dat, stack: 'Bar Stack' }
      })
    else
      series = series.map(dat => {
        return { ...dat, stack: null }
      })
    this.setState({
      barStacked: value
    }, () => this.setOptions(null, ['series'], series));
  }

  handleLabelConfig = (e) => {
    let series = this.state.options.series;
    const value = e.target.checked;

    if (value)
      series = series.map(dat => {
        return { ...dat, stack: 'Bar Stack' }
      })
    else
      series = series.map(dat => {
        return { ...dat, stack: null }
      })
    this.setState({
      barStacked: value
    }, () => this.setOptions(null, ['series'], series));
  }

  setChartSubTypeConfig = (chartName, value) => {
    switch (chartName) {
      case 'line-step':
        if (this.state.options) {
          let newSeries =
            //todo mapping or single
            //...this.state.options.series, step: value, type: 'line'
            this.state.options.series.map(dat => {
              return {
                ...dat, step: value, type: 'line'
              }
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

  setSingleAxisChartConfigs = (propertyName, propertyValue) => {
    if (this.state.options.dataset.source.length < MAX_LENGTH_SINGLEAXIS) {
      if (propertyName === 'yaxis') {
        let dataset = _.groupBy(this.state.options.dataset.source, (value) => { return value[propertyValue] });
        this.setState({
          singleAxisY: propertyValue,
          singleAxisDataset: dataset
        }, () => {
          this.setOptions(null, ['title'], Object.keys(dataset).map((key, idx) => {
            return {
              textBaseline: 'middle',
              top: (idx + 0.5) * 100 / 7 + '%',
              text: key
            }
          })
          )
        });
      }
      else if (propertyName === 'xaxis') {
        if (!!this.state.singleAxisY) {
          let series = Object.values(this.state.singleAxisDataset).map((dat, idx) => {
            return {
              singleAxisIndex: idx,
              coordinateSystem: 'singleAxis',
              type: 'scatter',
              data: dat.map(val => {
                return val[propertyValue]
              }),
            }
          });
          this.setState({
            singleAxisX: propertyValue
          }, () => this.setOptions(null, ['series'], series));
        }
        else {
          this.setError('Set Y axis first')
        }
      }
      else if (propertyName === 'symbolSize') {
        if (!!this.state.singleAxisY && !!this.state.singleAxisDataset && !!this.state.singleAxisX) {
          this.setOptions(null, ['singleAxisSymbolSize'], propertyValue);
          this.setState({
            symbolSizeVar: propertyValue,
          },
            () => {
              let newSeries = this.state.options.series.map((dat, idx) => {
                let { options } = this.state;
                return {
                  ...dat,
                  symbolSize: (dataItem) => {
                    //todo check :dataItem[this.state.singleAxisSymbolSize]
                    let { symbolSizeVar } = options;
                    return dataItem[symbolSizeVar] ? dataItem[symbolSizeVar] : dataItem;
                  }
                }
              });
              this.setOptions(null, ['series'], newSeries);
            })
        }
        else {
          this.setError('One of the above chart specific field is not filled.')
        }
      }
      else if (propertyName === 'multiplier') {
        this.setState({
          options: { ...this.state.options, multiplier: propertyValue },
        },
          () => {
            let newSeries = this.state.options.series.map((dat, idx) => {
              let { options } = this.state;

              return {
                ...dat,
                symbolSize: (dataItem) => {
                  let { multiplier } = options;
                  let { symbolSizeVar } = options;
                  return dataItem[symbolSizeVar] ? dataItem[symbolSizeVar] * parseFloat(multiplier) : dataItem * parseFloat(multiplier);
                }
              }
            });
            this.setOptions(null, ['series'], newSeries);
          });
      }
    }
    else {
      this.setError(`Dataset size exceeds the limit ${MAX_LENGTH_SINGLEAXIS}`)
    }

    if (!this.state.options.singleAxis.length && !!this.state.singleAxisY && !!this.state.singleAxisDataset) {
      this.setOptions(null, ['singleAxis'],
        Object.keys(this.state.singleAxisDataset).map((dat, idx) => {
          return {
            left: 150,
            type: 'category',
            boundaryGap: false,
            top: (idx * 100 / 7 + 5) + '%',
            height: (100 / 7 - 10) + '%',
            axisLabel: {
              interval: 2
            }
          }
        })
      )
    }
  }
  renderChartSpecificControls = (chartName) => {
    switch (chartName) {
      case 'line-step':        
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
        return <div>
          <h3>Dimension:</h3> &nbsp;
          <Dropdown
            placeholder='Select dimension'
            selection
            style={{ width: '250px' }}
            value={this.state.yAxisDimension[0] || ''}
            onChange={(e, { value }) => this.setState({ yAxisDimension: [value] }, () => {
              let newSeries = this.state.options.series.map(val => {
                return { ...val, encode: { ...val.encode, y: value } }
              })              
              this.setOptions(null, ['series'], newSeries);
            })}
            options={
              !!this.state.dataInfo && this.state.dataInfo.filter(data => {
                return data.type === 'STRING' || data.type === 'String'
              }).map(type => {
                return { key: type.name, value: String(type.name), text: type.name }
              })
            } />
          <br />
          <h3 style={{ display: 'inline-block' }}>Stacked</h3> &nbsp;
          <Input
            type="checkbox"
            name={'stacked'}
            checked={this.state.barStacked || false}
            size="large"
            onChange={this.handleStackedConfig}
          />
          <br />
        </div>
      case 'pie-custom':
        return <div>
          <h3>Dimension:</h3> &nbsp;
          <Dropdown
            placeholder='Select dimension'
            selection
            style={{ width: '250px' }}
            defaultValue={this.state.pieDimension || ''}
            onChange={(e, { value }) => this.setState({ pieDimension: value }, () => {
              this.setOptions('series', ['encode', 'itemName'], value)
            })}
            options={
              !!this.state.dataInfo && this.state.dataInfo.filter(data => {
                return data.type === 'STRING' || data.type === 'String'
              }).map(type => {
                return { key: type.name, value: String(type.name), text: type.name }
              })
            } />
          <h3>Value:</h3> &nbsp;
          <Dropdown
            placeholder='Select dimension'
            selection
            style={{ width: '250px' }}
            defaultValue={this.state.pieDimension || ''}
            onChange={(e, { value }) => this.setState({ pieValue: value }, () => {
              this.setOptions('series', ['encode', 'value'], value)
            })}
            options={
              !!this.state.dataInfo && this.state.dataInfo.filter(data => {
                return data.type === 'NUMBER' || data.type === 'Number'
              }).map(type => {
                return { key: type.name, value: String(type.name), text: type.name }
              })
            } />
          <h3>Rose type</h3> &nbsp;
            <Dropdown
            placeholder='Select Rosetype'
            selection
            style={{ width: '250px' }}
            value={this.state.options.series['roseType']}
            onChange={(e, { value }) => value !== 'none' ? this.setOptions('series', ['roseType'], value) : this.setOptions('series', ['roseType'], false)}
            options={
              ['radius', 'area', 'none'].map(type => {
                return { key: type, value: String(type), text: type }
              })
            } />
        </div>
      case 'candlestick-simple':
      case 'candlestick-large':
        return this.renderCandlestickSpecificControls();
      case 'bubble-gradient':
        return <div>
          <h3>Size dimension</h3> &nbsp;
         <Dropdown
            placeholder='Select Size dimension'
            selection
            style={{ width: '250px' }}
            onChange={(e, { value }) => this.setState({
              options: { ...this.state.options, symbolSizeVar: value }
            }, () => {
              let { options } = this.state;
              let newSeries = options.series.map(val => {
                return { ...val, symbolSize: (data) => { let { symbolSizeVar } = options; return data[symbolSizeVar] } }
              })
              this.setOptions(null, ['series'], newSeries)
            }
            )}
            options={
              !!this.state.dataInfo && !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => !this.state.yAxisDimension.includes(dat.name) && dat.type === 'NUMBER'), (key) =>
                ({ key: key.name, value: String(key.name), text: key.name }))} />
          <h3>Multiplier:</h3> &nbsp;
          <Input
            type="number"
            name={'Multiplier'}
            id={'Multiplier'}
            required
            minLength="1"
            maxLength="2"
            min="1"
            max="99"
            size="20"
            defaultValue="1"
            size="small"
            onChange={(e, { value }) => {
              this.setState({
                options: { ...this.state.options, multiplier: value },
              },
                () => {
                  let newSeries = this.state.options.series.map((dat, idx) => {
                    let { options } = this.state;

                    return {
                      ...dat,
                      symbolSize: (dataItem) => {
                        let { multiplier } = options;
                        let { symbolSizeVar } = options;
                        return dataItem[symbolSizeVar] ? dataItem[symbolSizeVar] * parseFloat(multiplier) : dataItem * parseFloat(multiplier);
                      }
                    }
                  });
                  this.setOptions(null, ['series'], newSeries);
                });
            }}
          />
        </div>
      case 'scatter-single-axis':
        return <div>
          <h3>Dimensions:</h3> &nbsp;
         <Dropdown
            placeholder='Select dimension'
            selection
            style={{ width: '250px' }}
            defaultValue={'start'}
            onChange={(e, { value }) => this.setSingleAxisChartConfigs('yaxis', value)}
            options={
              !!this.state.dataInfo && !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => dat.type === 'STRING'), (key) =>
                ({ key: key.name, value: String(key.name), text: key.name }))} />

          <h3>X-Axis:</h3> &nbsp;
         <Dropdown
            placeholder='Select X-axis dimension:'
            selection
            style={{ width: '250px' }}
            defaultValue={'start'}
            onChange={(e, { value }) => this.setSingleAxisChartConfigs('xaxis', value)}
            options={
              !!this.state.dataInfo && !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => dat.type === 'NUMBER'), (key) =>
                ({ key: key.name, value: String(key.name), text: key.name }))} />

          <h3>Size dimension:</h3> &nbsp;
         <Dropdown
            placeholder='Select Size dimension'
            selection
            style={{ width: '250px' }}
            onChange={(e, { value }) => this.setSingleAxisChartConfigs('symbolSize', value)}
            options={
              !!this.state.dataInfo && !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => dat.type === 'NUMBER'), (key) =>
                ({ key: key.name, value: String(key.name), text: key.name }))} />
          <h3>Multiplier:</h3> &nbsp;
          <Input
            type="number"
            name={'Multiplier'}
            id={'Multiplier'}
            required
            minLength="1"
            maxLength="2"
            min="1"
            max="99"
            size="20"
            defaultValue="1"
            size="small"
            onChange={(e, { value }) => {
              this.setSingleAxisChartConfigs('multiplier', value)
            }}
          />
        </div>
      default:        
        return null;
    }
  }

  setCandleStickConfig = (posn, value) => {
    this.setState({
      candlestickYEncoding: Object.assign([...this.state.candlestickYEncoding], { [posn]: value })
    }, () => {
      if (this.state.candlestickYEncoding.length === 4 && this.state.candlestickYEncoding.every(val => !!val))
        this.setOptions('series', ['0', 'encode', 'y'], this.state.candlestickYEncoding);
    })

  }

  renderCandlestickSpecificControls = () => {
    return (<div>
      <h3>Select Open: </h3> &nbsp;
        <Dropdown
        placeholder='Select Open'
        selection
        style={{ width: '250px' }}
        value={this.state.candlestickYEncoding[0] || ''}
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
        value={this.state.candlestickYEncoding[1] || ''}
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
        value={this.state.candlestickYEncoding[2] || ''}
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
        value={this.state.candlestickYEncoding[3] || ''}
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

  dimensionOptions = (axisName, chartType, dataType) => { // axisName: x or y
    if (axisName === 'x') {
      switch (chartType) {
        case 'line':
          return dataType === 'NUMBER' || dataType === 'TIME' || dataType === 'STRING'
        case 'bar':
          return dataType === 'NUMBER'
        case 'pie':
          return dataType === 'STRING'
        case 'candlestick':
          return dataType === 'TIME'
        case 'scatter':
        default:
          return true;
      }
    }
    else {
      switch (chartType) {
        case 'line':
        case 'scatter':
          if (this.state.chartSubType === 'line-step')
            return dataType === 'NUMBER' || dataType === 'TIME' || dataType === 'STRING'
          return dataType === 'NUMBER' || dataType === 'TIME'
        case 'bar':
          return dataType === 'NUMBER'
        case 'candlestick':
          return dataType === 'NUMBER'
        default:
          return true;
      }
    }
  }

  setXAxisField = (value, idx = 0) => {
    switch (this.state.chartSubType) {
      case 'pie-custom':
        this.setState({
          xAxisDimension: value
        },
          () => this.setOptions('series', ['encode', 'x'], value));
        break;

      case 'bar-y-category-stack':
        let encode = this.state.options.series[0].encode || {}; // if encode is already set on given field
        this.setOptions('series', [idx], { ...this.state.options.series[0], name: value, encode: { ...encode, x: value } })
        break;
      case 'candlestick-simple':
      case 'candlestick-large':
      case 'scatter-single-axis':
      case 'bubble-gradient':
      case 'line-simple':
      case 'area-stack':
      case 'line-step':
      default:
        let series = !!this.state.options.series.length ? this.state.options.series.map(val => {
          return { ...val, encode: { ...val.encode, x: value } }
        }) : [{ type: this.state.chartType, encode: { x: value } }];
        this.setOptions(null, ['series'], series);
        this.setOptions('xAxis', ['0'], {
          ...this.state.options.xAxis[0],
          name: value,
          nameLocation: 'center',
          nameTextStyle: {
            verticalAlign: 'bottom',
            align: 'center',
            lineHeight: 80,
          },
          type: !!this.state.dataInfo.find(dat => dat.name === value && dat.type === 'TIME') ? 'time' : 'category'
        })
    }

  }

  setYAxisFields = (value, idx) => {
    switch (this.state.chartSubType) {
      case 'bubble-gradient':
        let { options } = this.state;
        this.setOptions('legend', ['data'], [...this.state.options.legend.data, value])

        this.setOptions('series', [idx], {
          ...(() => {
            let randomValue = () => Math.floor(Math.random() * (255 - 0 + 1)) + 0;
            let color = `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
            // let shadow
            return {
              name: value,
              type: 'scatter',
              symbolSize: (dataItem) => {
                let { multiplier } = options;
                let { symbolSizeVar } = options;
                multiplier = multiplier || 1;
                return dataItem[symbolSizeVar] ? dataItem[symbolSizeVar] * parseFloat(multiplier) : dataItem * parseFloat(multiplier);
              },
              label: {
                emphasis: {
                  show: true,
                  formatter: function (param) {
                    return param.data[param.seriesName];
                  },
                  position: 'top'
                }
              },
              itemStyle: {
                normal: {
                  shadowBlur: 10,
                  // shadowColor: 'rgba(25, 100, 150, 0.5)',
                  shadowColor: 'rgba(0, 0, 0, 0.4)',
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
          })(), encode: { x: this.state.xAxisDimension, y: value }
        })
        break;
      case 'line-simple':
      case 'line-step':
      case 'area-stack':
        //todo: after reaching home
        //todo look at setting value and encode params
        this.setOptions('legend', ['data'], [...this.state.options.legend.data, value])
        this.setOptions('series', [idx], { ...this.state.options.series[0], name: value, encode: { x: this.state.xAxisDimension, y: value } })
        break;
      case 'bar-y-category-stack':
        break;
      case 'pie-custom':
      case 'scatter-single-axis':
      case 'candlestick-simple':
      case 'candlestick-large':
      default: {
        let values = Object.assign([...(!!this.state.options.series.encode && !!this.state.options.series.encode.y) ? this.state.options.series.encode.y : []], { [idx]: value })
        this.setOptions('series', ['encode', 'y'], values);
      }
    }
    this.state.dataInfo.find(dat => {
      if (this.state.yAxisDimension.includes(dat.name) && dat.type === 'TIME') {
        this.setOptions('yAxis', ['type'], 'time');
      }
    });
  }

  xAxisFields = () => {
    let chartXFieldType = _.findKey(axisFields.x, (item) => { return item.includes(this.state.chartSubType) });
    switch (chartXFieldType) {
      case 'multiple':
        return <React.Fragment>
          {this.state.multiplexAxisDimension.map((field, idx) => {
            return (
              <React.Fragment key={`${Math.random()}`}><Dropdown
                placeholder='Select Dimension'
                selection
                style={{ width: '250px' }}
                value={this.state.multiplexAxisDimension[idx] || ''}
                // defaultValue={this.state.yAxisDimension}
                // value={this.state.yAxisDimension}
                // value={{ key: this.state.yAxisDimension, value: String(this.state.yAxisDimension), text: this.state.yAxisDimension }}
                onChange={(event, { value }) => this.setState({ multiplexAxisDimension: Object.assign([...this.state.yAxisDimension], { [idx]: value }) }, () => {
                  this.setXAxisField(value, idx);
                  // this.setOptions(null, ['dataset', 'dimensions'], Array.from(new Set([this.state.yAxisDimension, ...this.state.options.dataset.dimensions])))
                })}
                options={
                  !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => dat.name !== this.state.xAxisDimension && this.dimensionOptions('x', this.state.chartType, dat.type)), (key) =>
                    ({ key: key.name, value: String(key.name), text: key.name }))} /> <br /> <br /></React.Fragment>
            )
          })}
          &nbsp; <Button inverted size="mini" icon='add' onClick={() => this.setState({ multiplexAxisDimension: [...this.state.multiplexAxisDimension, ''] })} />
        </React.Fragment>
        break;
      case 'single':
        return <Dropdown
          placeholder='Select Dimension'
          selection
          style={{ width: '250px', }}
          value={this.state.xAxisDimension || ''}
          onChange={(event, { value }) => this.setState({ xAxisDimension: value }, () => {

            this.setXAxisField(value);
            this.chartInitialization("main", this.state.options.dataset);
          })}
          options={
            !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => !this.state.yAxisDimension.includes(dat.name) && this.dimensionOptions('x', this.state.chartType, dat.type)), (key) =>
              ({ key: key.name, value: String(key.name), text: key.name }))} />
        break;
      case 'none':
        break;
      default:
        console.log('THE ONE THAT GOT SLIPPED AWAY');
    }
  }
  yAxisFields = (yAxisDimensions) => {
    let chartYFieldType = _.findKey(axisFields.y, (item) => { return item.includes(this.state.chartSubType) });
    switch (chartYFieldType) {
      case 'multiple':
        return <React.Fragment>
          {this.state.yAxisDimension.map((field, idx) => {
            return (
              <React.Fragment key={`${Math.random()}`}><Dropdown
                placeholder='Select Dimension'
                selection
                style={{ width: '250px' }}
                // defaultValue={this.state.yAxisDimension}
                value={this.state.yAxisDimension[idx] || ''}
                // value={{ key: this.state.yAxisDimension, value: String(this.state.yAxisDimension), text: this.state.yAxisDimension }}
                onChange={(event, { value }) => this.setState({ yAxisDimension: Object.assign([...this.state.yAxisDimension], { [idx]: value }) }, () => {
                  this.setYAxisFields(value, idx);
                  // this.setOptions(null, ['dataset', 'dimensions'], Array.from(new Set([this.state.yAxisDimension, ...this.state.options.dataset.dimensions])))
                })}
                options={
                  !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => dat.name !== this.state.xAxisDimension && this.dimensionOptions('y', this.state.chartType, dat.type)), (key) =>
                    ({ key: key.name, value: String(key.name), text: key.name }))} /> <br /> <br /></React.Fragment>
            )
          })}
          &nbsp; <Button inverted size="mini" icon='add' onClick={() => this.setState({ yAxisDimension: [...this.state.yAxisDimension, ''] })} />
        </React.Fragment>
      case 'single':
        break;
      case 'none':
        break;
      default:
        console.log('THE ONE THAT GOT SLIPPED AWAY');
    }
  }
  renderSimpleControls = () => {
    if (this.state.chartSubType === 'custom-gantt-flight') {
      return (<div>
        <div style={{ textAlign: 'left' }}>Chart specific</div>
        <h3>Datasource: </h3> &nbsp;
        <Dropdown
          placeholder='Select Data source'
          selection
          style={{ width: '250px' }}
          value={this.state.gantDataSource || ''}
          onChange={(e, { value }) => this.setState({
            gantDataSource: value
          })}
          options={
            !!this.state.options && ['schedules', 'druid-sources'].map(type => {
              return { key: type, value: String(type), text: type }
            })
          } />
        <h3>View mode: </h3> &nbsp;
        <Dropdown
          placeholder='Select Data source'
          selection
          style={{ width: '250px' }}
          value={this.state.gantViewMode || ''}
          onChange={(e, { value }) => this.setState({
            gantViewMode: value
          })}
          options={
            !!this.state.options && [
              'Quarter Day',
              'Half Day',
              'Day',
              'Week',
              'Month',
              'Year'
            ].map(type => {
              return { key: type, value: String(type), text: type }
            })
          } />
        {this.state.gantDataSource === 'druid-sources' && (<React.Fragment>
          <h3>Start Dimension: </h3> &nbsp;
          <Dropdown
            placeholder='Select Dimension'
            selection
            style={{ width: '250px', }}
            // defaultValue={this.state.xAxisDimension}
            value={this.state.gantDimensions.start || ''} //{ key: this.state.xAxisDimension, value: String(this.state.xAxisDimension), text: this.state.xAxisDimension }}
            onChange={(event, { value }) => this.setState({
              gantDimensions: { ...this.state.gantDimensions, start: value }
            })}
            options={
              !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => this.state.gantDimensions.end !== dat.name && dat.type === 'TIME'), (key) =>
                ({ key: key.name, value: String(key.name), text: key.name }))} />
          <h3>End Dimension: </h3> &nbsp;
          <Dropdown
            placeholder='Select Dimension'
            selection
            style={{ width: '250px', }}
            // defaultValue={this.state.xAxisDimension}
            value={this.state.gantDimensions.end || ''} //{ key: this.state.xAxisDimension, value: String(this.state.xAxisDimension), text: this.state.xAxisDimension }}
            onChange={(event, { value }) => this.setState({
              gantDimensions: { ...this.state.gantDimensions, end: value }
            })}
            options={
              !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => this.state.gantDimensions.start !== dat.name && dat.type === 'TIME'), (key) =>
                ({ key: key.name, value: String(key.name), text: key.name }))} />
          <h3>Name Dimension: </h3> &nbsp;
          <Dropdown
            placeholder='Select Dimension'
            selection
            style={{ width: '250px', }}
            // defaultValue={this.state.xAxisDimension}
            value={this.state.gantDimensions.name || ''} //{ key: this.state.xAxisDimension, value: String(this.state.xAxisDimension), text: this.state.xAxisDimension }}
            onChange={(event, { value }) => this.setState({
              gantDimensions: { ...this.state.gantDimensions, name: value }
            })}
            options={
              !!this.state.dataInfo && _.map(this.state.dataInfo.filter(dat => dat.type === 'STRING'), (key) =>
                ({ key: key.name, value: String(key.name), text: key.name }))} />
        </React.Fragment>)
        }
      </div>)
    }
    return (<div>
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
      <h3>Color theme: </h3> &nbsp;
          <Dropdown
        placeholder='Select Theme'
        selection
        style={{ width: '250px' }}
        defaultValue={'default'}
        onChange={(e, { value }) => {
          this.setState({
            theme: value
          }, () => {
            this.chartInitialization("main", this.state.options.dataset, value)
          })
        }}
        options={
          !!this.state.options && ['default', 'light', 'dark'].map(theme => {
            return { key: theme, value: String(theme), text: theme }
          })
        } />
      {/* <h3>Sort By: </h3> &nbsp; */}
      <h3>X-Axis: </h3> &nbsp;
        {this.xAxisFields()}

      <h3>Y-Axis: </h3> &nbsp;
        {this.yAxisFields(this.state.yAxisDimension)}
      <h3>Orientation: </h3> &nbsp;
        <Dropdown
        placeholder='Select Orientation'
        selection
        style={{ width: '250px' }}
        value={this.state.orientation || ''}
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
      let pointKeys = Object.keys(data.option.properties);
      let point = Object.values(data.option.properties)[
        this.state.currentPoint
      ];
      let properties1 = !!properties
        ? Object.keys(properties)
        : Object.keys(point.properties)

      return properties1.map((dat, index) => {
        let propertyValue = !!properties ? properties[dat] : point.properties[dat];
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

    let path = (parentPropertyName !== null) ? [parentPropertyName, ...propertyPath] : [...propertyPath];
    this.setState(
      {
        options: _.set(
          this.state.options,
          path,
          propertyValue
        )
      },
      () => {
        if (this.state.chart){
          this.state.chart.setOption(this.state.options);
        }
        console.log('after setOptions', this.state)
      }
    );
  };

  handleChartTypeChange = (value) => {
    // let value = e.target.value;
    this.setState({
      chartType: value,
      chartSubType: chartSubTypes[value][0],
      xAxisDimension: '',
      yAxisDimension: [''],
      multiplexAxisDimension: ['']
    }, () => {
      let { chart } = this.state;
      if (chart !== undefined && this.state.chartSubType !== 'custom-gantt-flight') {
        this.configurator(chartSubTypes[value][0], this.state.options, this.setOptions, this.chartInitialization, 'some chart', this.state.xAxisDimension)
      }
    })
  };

  setChartTypes = () => {

    return (
      <Grid style={{ marginLeft: '300px', marginBottom: '5px', height: '100px' }}>
        {
          Object.keys(chartIcons).map(iconKey => {
            return <Grid.Column key={iconKey} style={{ height: '80px', marginRight: '20px', cursor: 'pointer' }} onClick={() => this.handleChartTypeChange(iconKey)} >{chartIcons[iconKey]({ color: this.iconColor(iconKey === this.state.chartType, 'dark') })}<label>{iconKey}</label></Grid.Column>
          })
        }
      </Grid>
    );
  }

  setChartDataSet = (dataset) => {
    this.setState({
      options: {
        ...this.state.options,
        dataset: dataset
      },
      xAxisDimension: '',
      yAxisDimension: [''],
      multiplexAxisDimension: [''],
    }, () => {
      this.state.chartSubType !== 'custom-gantt-flight' && this.configurator(this.state.chartSubType, this.state.options, this.setOptions, this.chartInitialization, 'some chart', this.state.xAxisDimension)
    });

  }

  saveConfiguration = () => {
    let optionsJson = JSON.stringify({ options: this.state.options, theme: this.state.theme }, function (key, value) {
      if (key === 'dataset') {
        return undefined;
      }
      if (typeof value === "function") {
        return "/Function(" + value.toString() + ")/";
      }
      return value;
    });
    localStorage.setItem('chartConfig', optionsJson)
  }

  updateConfig = (config) => {
    this.setState({
      config
    })
  }

  setParentmountedFalse = () => {
    this.setState({
      parentMounted: false
    })
  }

  render() {
    return (
      <div className="chart-creator" ref={this.containerRef}>
        <Sidebar.Pushable as={Segment} style={{ background: '#333', color: 'white', overflowY: 'hidden' }}>
          <Sidebar animation="push" style={{ width: '290px' }} as={Menu} animation='push' icon='labeled' inverted vertical visible>
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
            className="wide-sidebar"
          >
            {this.state.data !== undefined
              && <div onClick={() => { this.setState({ leftSidebar: 'options' }) }} style={{ cursor: 'pointer', borderBottom: '1px solid white', padding: '5px 10px 5px 10px', marginBottom: '5px', textTransform: 'uppercase', textAlign: 'left' }}><Icon size="large" name="arrow left" />{Object.keys(this.state.data.option.properties)[this.state.currentPoint]} </div>
            }
            <div>{this.renderAdvancedControls()}</div>
          </Sidebar>
          }
          <h1>
            <div className="ui labeled tiny button" tabIndex="0">
              <div className={`ui tiny button ${this.state.simpleControls ? 'yellow' : ''}`} onClick={() => this.setState({ simpleControls: true })}>
                Simple Settings
              </div>
              <a className={`ui left pointing label ${!this.state.simpleControls ? 'yellow' : ''}`} onClick={() => this.setState({ simpleControls: false })}>
                Advanced Settings
              </a>
              &nbsp;&nbsp;
              <Modal trigger={<i className="database icon big" style={{ color: 'white' }} />} basic size='small'>
                <h2>Upload excel or csv file</h2>
                <form onSubmit={this.handleFileSubmit}>
                  <label>
                    Upload file:
                  <input type="file" ref={this.fileInput} />
                  </label>
                  <br />
                  <button type="submit">Submit</button>
                </form>
              </Modal>
            </div>

          </h1>
          {this.setChartTypes()}
          <Sidebar.Pusher >
            <div className="chart-pusher">
              <div
                style={{
                  background: '#333', color: 'white', height: '100%'
                }}
              >
                <div id="main" style={{ background: 'white', marginLeft: '10px', display: this.state.chartSubType !== 'custom-gantt-flight' ? 'block' : 'none', height: `${document.querySelector('.chart-creator') && document.querySelector('.chart-creator').offsetHeight - 175}px` }} />
                {/* {this.state.chartSubType === 'custom-gantt-flight' && this.chartDeInitialization() && <GanttChart updateConfig={this.updateConfig} druidData={this.state.options.dataset.source} gantDimensions={this.state.gantDimensions} initializeOnGanttUnmount={this.initializeOnGanttUnmount} gantDataSource={this.state.gantDataSource} gantViewMode={this.state.gantViewMode} />} */}
              </div>
            </div>
          </Sidebar.Pusher>
          <Sidebar as={Menu} animation='push' direction='right' icon='labeled' inverted vertical visible width='thin'>
            {chartSubTypes[this.state.chartType].map(dat => <Menu.Item key={dat} style={{ background: this.state.chartSubType === dat ? '#707070' : '' }} onClick={() => { this.configurator(dat, this.state.options, this.setOptions, this.chartInitialization, 'some chart', this.state.xAxisDimension) }} ><div data-tooltip={dat} data-position="bottom left"><Image src={`https://raw.githubusercontent.com/ecomfe/echarts-examples/gh-pages/public/data/thumb/${dat}.png`} /></div></Menu.Item>
            )}
          </Sidebar>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export class ChartEditor extends React.Component {
  state = {
    fatalError: false
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { fatalError: true, error };
  }
  render() {
    if (!this.state.fatalError) {
      return <ChartCreator fatalError={this.state.fatalError} {...this.props} />
    }
    else {
      return (<div>
        <h2>
          The configurations for chart was not set right, so some error occured.
            Reload the page <Icon name="redo" onClick={() => this.setState({ fatalError: false })} />
        </h2>
      </div>);
    }
  }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<ChartEditor />, rootElement);
