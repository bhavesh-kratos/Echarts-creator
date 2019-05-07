import React from 'react';
import echart from "echarts";

// let options = { multiplier: '1.5', singleAxisSymbolSize: 'something' };
class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.loadConfiguration = this.loadConfiguration.bind(this);
    }
    componentDidMount() {
        let config = this.loadConfiguration()
        let chart = echart.init(document.getElementById("chart"), !!config.theme ? config.theme : 'default')
        chart.setOption(config.options)
    }
    loadConfiguration() {
        let optionsJson = localStorage.getItem('chartConfig')
        let options = JSON.parse(optionsJson).options;
        let config = JSON.parse(optionsJson, (key, value) => {
            if (typeof value === "string" &&
                value.startsWith("/Function(") &&
                value.endsWith(")/")) {
                value = value.substring(10, value.length - 2);
                // return Function('return (' + value + ')')();
                return eval("(" + value + ")");         //todo: try it with curried function approach using function constructor only as its safe method

            }
            return value;
        });
        return config;
    }

    render() {
        return (
            <div id="chart" style={{ background: 'white', marginLeft: '20px', width: "600px", height: "450px" }} />
        );
    }
}

export default Chart;