import React from 'react';
import "./gantt.css";
import Gantt from "frappe-gantt";
import { Label } from 'semantic-ui-react';
import moment from "moment";

function getDateFromTime(time, date = moment()) {
    let timeArr = time.split(":");
    date.hour(timeArr[0]);
    date.minute(timeArr[1]);
    date.second(timeArr[2]);
    return date;
}
class Gantt1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            options: {
                on_click: function (task) {
                    console.log(task);
                },
                on_date_change: function (task, start, end) {
                    console.log(task, start, end);
                },
                on_progress_change: function (task, progress) {
                    console.log(task, progress);
                },
                on_view_change: function (mode) {
                    console.log(mode);
                },
                step: 24 / 8,
                date_format: 'MM/DD/YYYY HH:mm:ss',
                column_width: 60,
                view_mode: 'Quarter Day',
                language: 'en',
                bar_being_dragged: null,
                is_resizing: false,
                popup_trigger: 'click',
                // ...this.props.gantDimensions
            }
        }
    }

    dataSchedulesApi = () => {
        let b = "{\"data\":{\"schedules\":{\"edges\":[{\"node\":{\"onTime\":\"05:30:00\",\"offTime\":\"09:15:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:54.000921+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay12\",\"displayName\":\"Exhaust + FA\"}}},{\"node\":{\"onTime\":\"10:30:00\",\"offTime\":\"23:15:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:54.000921+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay12\",\"displayName\":\"Exhaust + FA\"}}},{\"node\":{\"onTime\":\"10:30:00\",\"offTime\":\"23:30:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:54.093983+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay17\",\"displayName\":\"Customer AC-2\"}}},{\"node\":{\"onTime\":\"10:30:00\",\"offTime\":\"23:30:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:54.058593+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay13\",\"displayName\":\"Customer AC-1\"}}},{\"node\":{\"onTime\":\"09:30:00\",\"offTime\":\"23:00:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:53.955238+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay14\",\"displayName\":\"Makeline\"}}},{\"node\":{\"onTime\":\"09:30:00\",\"offTime\":\"23:00:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:54.170416+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay11\",\"displayName\":\"Back AC\"}}},{\"node\":{\"onTime\":\"18:00:00\",\"offTime\":\"23:00:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:53.896613+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay16\",\"displayName\":\"Outdoor Signage\"}}},{\"node\":{\"onTime\":\"09:30:00\",\"offTime\":\"02:00:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:54.132482+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay10\",\"displayName\":\"Manager AC\"}}},{\"node\":{\"onTime\":\"10:00:00\",\"offTime\":\"00:00:00\",\"daysOfWeek\":\"0,1,2,3,4,5,6\",\"createdAt\":\"2018-11-12T07:56:54.208001+00:00\",\"status\":\"PENDING\",\"enabled\":true,\"meter\":{\"devicePath\":\"/Dominos-21/Relay15\",\"displayName\":\"Lighting\"}}}]}}}"
        let tasks = this.processSchedulesApi(b);
        this.setState({
            tasks
        }, () => {
            this.createGantt(this.state.tasks)
        })
    }

    async componentDidMount() {
        let data = this.props.druidData;
        if (!!this.props.gantDimensions.start && !!this.props.gantDimensions.end && !!this.props.gantDimensions.name && !!this.props.druidData.length) {
            data = await this.processDruidApi(this.props.druidData, this.props.gantDimensions);            
        }
        await this.setState({
            tasks: data 
        }, () => this.createGantt(this.state.tasks))
    }

    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.gantDataSource !== prevProps.gantDataSource && this.props.gantDataSource === 'schedules') {
            this.dataSchedulesApi();
        }
        else if (this.props.gantViewMode !== prevProps.gantViewMode && this.props.gantDataSource === 'druid-sources') {
            this.setState({
                options: { ...this.state.options, view_mode: this.props.gantViewMode }
            }, () => {
                this.createGantt(this.state.tasks);
            })
        }

        if (!!this.props.gantDimensions.start && !!this.props.gantDimensions.end && !!this.props.gantDimensions.name && (prevProps.gantDimensions.start !== this.props.gantDimensions.start || prevProps.gantDimensions.end !== this.props.gantDimensions.end || prevProps.gantDimensions.name !== this.props.gantDimensions.name || this.props.view_mode !== prevProps.view_mode) && !!this.props.druidData.length) {
            let data = await this.processDruidApi(this.props.druidData, this.props.gantDimensions);
            await this.setState({
                tasks: data
            }, () => this.createGantt(this.state.tasks))
        }
    }

    componentWillUnmount() {
        !!this.props.initializeOnGanttUnmount && this.props.initializeOnGanttUnmount()
    }


    createGantt = (tasks) => {
        let verifiedData = tasks.length !== 0;
        if (verifiedData) {
            var gantt_chart = new Gantt(".gantt-target", tasks, this.state.options);
            // gantt_chart.change_view_mode('Quarter Day')
            console.log(gantt_chart);
        }
    }

    processSchedulesApi = (response) => {
        let dateText = "04-11-2019"
        let selected_client = null;

        let dataset = [];
        let data = JSON.parse(response)['data']['schedules']['edges'];

        let newData = data.map(function (schedule_node, idx) {

            let itemSchedule = schedule_node['node'];
            let onDate = moment(getDateFromTime(itemSchedule['onTime'], moment(dateText)));
            let offDate = moment(getDateFromTime(itemSchedule['offTime'], moment(dateText)));
            if (onDate > offDate) offDate.add(1, 'day');
            return { custom_class: 'bar-milestone', start: onDate.format("YYYY-MM-DD HH:mm:ss"), end: offDate.format("YYYY-MM-DD HH:mm:ss"), name: itemSchedule['meter']['displayName'], id: `${idx}`, progress: 100 }
        });
        return newData;

        // for (let meter_path in meter_to_schedule_dict) {
        //     // Rendering library needs sorted table of schedules, otherwise they'll be ignored.
        //     let meter_schedules = meter_to_schedule_dict[meter_path].sort(function (x, y) {
        //         return ((new Date(x[0])) - (new Date(y[0])));
        //     });
        //     let display_name = meter_to_display_names[meter_path];
        //     dataset.push({
        //         "measure": display_name,
        //         "categories": {
        //             "ON": { "color": "#26a69a" },
        //             "OFF": { "color": "#174e9e" }
        //         },
        //         ...meter_schedules
        //     });
        // }
        // dataset.sort(function (x, y) {
        //     return x["measure"].localeCompare(y["measure"]);
        // });
        // console.log('sdasds', dataset)
    }

    processDruidApi = (data, { start, end, name }) => {
        let newData = data.map(function (dat, idx) {
            let startDate = moment(dat[start]).format()
            let endDate = moment(dat[end]).format()
            return { custom_class: 'bar-milestone', start: startDate, end: endDate, name: dat[name], id: `${idx}`, progress: 100 }
        });
        return newData;
    }
    render() {
        return (
            <div style={{ zIndex: '4000' }} className="container">
                <div className="gantt-target"></div>
            </div>

        );
    }
}

Gantt1.defaultProps = {
    updateConfig: undefined,
    druidData: [],
    gantDimensions: {},
    initializeOnGanttUnmount: undefined,
    gantDataSource: '',
    gantViewMode: 'Quarter Day'
}

export default Gantt1;