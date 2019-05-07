import React from 'react';
import echart from "echarts";

// let options = { multiplier: '1.5', singleAxisSymbolSize: 'something' };
class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}

    }
    componentDidMount() {

        let {config} = this.props;        
        let chart = echart.init(document.getElementById("chart"), !!config.theme ? config.theme : 'default');
        chart.setOption(config.options);
    }

    render() {
        return (
            <div id="chart" style={{ background: 'white', marginLeft: '20px', width: "600px", height: "450px" }} />
        );
    }
}

export default Chart;