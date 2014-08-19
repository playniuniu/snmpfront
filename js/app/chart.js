// create ajax port request
function createPortChart(dev_name, port_name, month) {

    var portChartUrl = 'http://idcapi.uunus.com/billing?where={'
        + '"dev_name":"' + dev_name + '",'
        + '"port_name":"' + port_name + '",'
        + '"month":"' + month + '",'
        + '"datetype":"' + 'month' + '"}';

    ajaxGetData(portChartUrl, ajaxGenerateChart, ajaxFailedCallback);
}

// Generate chart from ajax data
function ajaxGenerateChart(response) {
    var ifData = parseMonthData(response);

    var $portContainer = $('#portInput').closest('.acontainer');
    var portName = $portContainer.children('input').last().val();
    portName = portName.replace(/-/g,'/');

    if(ifData != undefined) {
        var chartData = [];
        chartData.push({name: portName + '入', data: ifData['ifInData']});
        chartData.push({name: portName + '出', data: ifData['ifOutData']});

        var $portChart = $('.showArea');
        $portChart.hide();
        generateChart($portChart, portName, chartData);
        $portChart.show('slide',500);
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
