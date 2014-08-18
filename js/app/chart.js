// Generate chart from ajax data
function ajaxGenerateChart(response) {
    var ifData = parseMonthData(response);

    var port_name = 'Ethernet2/0/0';

    if(ifData != undefined) {
        var chartData = [];
        chartData.push({name: port_name + '入', data: ifData['ifInData']});
        chartData.push({name: port_name + '出', data: ifData['ifOutData']});

        var $portChart = $('.showArea');
        $portChart.hide();
        generateChart($portChart, port_name, chartData);
        $portChart.show('slide',500);
    }
}

// Create highstock.js chart
function generateChart(chartObj, chartTitle, chartData) {
    console.log('niuniu');
    console.log(chartObj.length);
    chartObj.highcharts('StockChart', {
        title : { text : chartTitle },
        legend: { enabled: true },
        series: chartData
    });
}

// parse month data from ajax request
function parseMonthData(raw_data) {

    if (raw_data['error'] == 'true') {
        alert("请求图形数据错误!");
        return undefined;
    }

    var ifHCInOctets = raw_data['data']['ifIn_data'];
    var ifHCOutOctets = raw_data['data']['ifOut_data'];
    var timeStamp = raw_data['data']['timeStamp'];

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
