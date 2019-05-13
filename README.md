# Echarts-creator
A React component to create and view selected set of charts from popular echarts library. This component provides an interface to the user to configure a chart from the selected options and its using e-charts and frappe-gantt underneath to generate the charts. 

### Data Input method ###
You can upload csv, xlsx mime type or any other file formats mentioned here https://www.npmjs.com/package/xlsx#file-formats, as it uses xlsx library to read data from the uploaded files.

### Charts types at this moment ###
line: basic line, dynamic data + time axis, stacked area chart, step line
bar: bar-y-category-stack
pie: calendar pie(not implemented), pie
scatter: bubble, scatter on single axis
candlestick: basic, large scale candlestick
Gantt chart



*For Gantt chart another library Frappe-gantt is being used

**No licensing is added right now. It will be either MIT or Apache version 2.0. 
