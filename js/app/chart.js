// Generate area chart
function generateAreaChart($showArea) {
    var month_data = $showArea.data('month_data');
    if(month_data == undefined || month_data == "") {
        $.notifyBar({
            cssClass: "error",
            html: "图形数据生成错误",
            delay: 2000
        });
        return;
    }

    var ifData = parseMonthData(month_data);
    var portName = $('#portInput').data('port_name');
    var devName = $('#deviceInput').data('dev_name');

    if(ifData != undefined) {
        var chartData = [];
        chartData.push({name: portName + '入', data: ifData['ifInData']});
        chartData.push({name: portName + '出', data: ifData['ifOutData']});

        $showArea.empty();
        generateChart($showArea, devName + ' - ' + portName, chartData);
        $showArea.show('slide',500);
    }
}

// Create highstock.js chart
function generateChart(chartObj, chartTitle, chartData) {
    chartObj.highcharts('StockChart', {
        title : { text : chartTitle },
        legend: { enabled: true },
        series: chartData
    });
}

// parse month data from ajax request
function parseMonthData(raw_data) {

    var ifHCInOctets = raw_data['ifIn_data'];
    var ifHCOutOctets = raw_data['ifOut_data'];
    var timeStamp = raw_data['timeStamp'];

    if(timeStamp.length != ifHCInOctets.length || timeStamp.length != ifHCOutOctets.length ) {
        alert("请求图形数据长度错误!");
        return undefined;
    }

    var ifInData = [],
        ifOutData = [];

    for(var i = 0; i < timeStamp.length; i++) {
        ifInData.push([timeStamp[i]*1000, ifHCInOctets[i]]);
        ifOutData.push([timeStamp[i]*1000, ifHCOutOctets[i]]);
    }

    return {
        'ifInData' : ifInData,
        'ifOutData' : ifOutData
    }
}
