//$(function() {
//    var deviceUrl = 'http://idcapi.uunus.com/devices';
//    ajaxGetData(deviceUrl, ajaxShowDevices, ajaxFailedCallback);
//});

// Get Ajax data from post value
function ajaxGetData(url, callbackFunc, failedFunc) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: false
        },
        success: callbackFunc,
        error: failedFunc,
        timeout: 5000
    });
}

// Process ajax failed callback
function ajaxFailedCallback(request) {
    alert( "请求 Ajax: " + this.url + " 失败!");
}

// Process ajax success callback
function ajaxShowDevices(response) {
    var deviceData = response['data'];
    var $deviceTable = $('#deviceTable');
    createDeviceTable($deviceTable, deviceData);
    onClickDeviceTable($deviceTable);
}

// create device table
function createDeviceTable($deviceTable, deviceData) {

    var tableData = [];

    for(var i = 0; i < deviceData.length; i++) {
        var dev_name = deviceData[i]['dev_name'];
        var ip = deviceData[i]['ip'];
        var sys_name = deviceData[i]['sys_name'];
        tableData.push([dev_name, ip, sys_name]);
    }

    $deviceTable.dataTable({
        "info" : false,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "destroy": true,
        "data": tableData,
        "columns": [
            { "title": "设备名称", "class": "center" },
            { "title": "IP地址", "class": "center" },
            { "title": "SYS Name", "class": "center" }
        ]
    });

    addFilter($deviceTable);
}

// listen on click device table
function onClickDeviceTable(deviceTable) {
    deviceTable.children('tbody').on('click', 'tr', function () {

        // Check if it is already selected
        if($(this).hasClass('success')) {
            return;
        }

        $(this).siblings().removeClass('success');
        $(this).addClass('success');
        var device_name = $('td', this).eq(0).text();
        createPortTable(device_name)
    });
}

// create ajax port request
function createPortTable(dev_name) {
    var portUrl = 'http://idcapi.uunus.com/ports/' + dev_name;

    ajaxGetData(portUrl, ajaxUpdatePortTable, ajaxFailedCallback);
}

// listen on click port table
function onClickPortTable(portTable) {
    portTable.children('tbody').on('click', 'tr', function () {

        // Check if it is already selected
        if($(this).hasClass('success')) {
            return;
        }

        $(this).siblings().removeClass('success');
        $(this).addClass('success');
        var port_name = $('td', this).eq(0).text();
        var device_name = $('#deviceTable').find('.success')
            .children('td').first().text();
        createPortDetailTable(device_name, port_name, '201408');
    });
}

// update port table according ajax data
function ajaxUpdatePortTable(response) {

    if(response['error'] == 'true') {
        alert("获取端口信息有误!");
        return;
    }

    var portListData = response['data'];
    var $portTable = $('#portTable');

    updatePortTable($portTable, portListData);
    onClickPortTable($portTable);
    refreshTable($portTable);

}

// updatePortTable
function updatePortTable($portTable, portData) {

    var tableData = [];

    for(var i = 0; i < portData.length; i++) {
        var name = portData[i]['ifDescr'];
        var type = portData[i]['ifType'];
//        var speed = portData[i]['ifType'];
        tableData.push([name, type]);
    }

    $portTable.dataTable({
        "info" : false,
        "paging": false,
        "destroy": true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "columns": [
            { "title": "端口名称", "class": "center" },
            { "title": "端口类型", "class": "center" }
        ],
        "language": {
            "search" : "查询端口："
        },
        "data": tableData
    });

    addFilter($portTable);
}

// add filter input for table
function addFilter($filterTable) {
    var $filter = $filterTable.closest('.tableClass').find('.searchFilter');
    var $input = $filter.find('input');
    var $allTableRows = $filterTable.find('tr');

    // add success class to selected row
    $filter.addClass('active');

    $input.focus(function() {
        // remove all selected class
        $allTableRows.removeClass('success');

        // clear input text
        $(this).val('');

        // clear filter vaule
        $filterTable.fnFilter('');

        if($filterTable.attr('id') == 'deviceTable') {

            var $realTable = $('#portTable').closest('.dataTables_scroll');

            if($realTable.is(":visible")) {
                $realTable.fadeOut('fast');
            }

        }
    });

    // prevent default form submit when press enter key
    $input.keypress(function(event) { return event.keyCode != 13; });

    // listen on keyup event
    $input.keyup(function(e) {
        $filterTable.fnFilter(this.value);

        // when press enter, select the first row
        if(e.keyCode == 13) {
            var filterRows = $filterTable.$('tr', {"filter": "applied"});

            if(filterRows.length > 0) {
                var firstRow = filterRows[0];
                $(firstRow).click();
                $(firstRow).addClass('success');
            }
        }

        // when press delete, clean select success
        if(e.keyCode == 8) {
            $allTableRows.removeClass('success');
        }
    });
}

// create ajax port request
function createPortDetailTable(dev_name, port_name, month) {

    var portDetailUrl = 'http://idcapi.uunus.com/billing?where={'
        + '"dev_name":"' + dev_name + '",'
        + '"port_name":"' + port_name + '",'
        + '"month":"' + month + '",'
        + '"datetype":"' + 'month' + '"}';

    var $portChart = $('.portContainer');
    $portChart.hide();
    ajaxGetData(portDetailUrl, ajaxPortDetailTable, ajaxFailedCallback);
}

function ajaxPortDetailTable(response) {
    var ifData = generateMonthData(response);

    var port_name = $('#portTable').find('.success')
        .children('td').first().text();

    var device_name = $('#deviceTable').find('.success')
        .children('td').first().text();

    if(ifData != undefined) {
        var chartData = [];
        chartData.push({name: port_name + '入', data: ifData['ifInData']});
        chartData.push({name: port_name + '出', data: ifData['ifOutData']});

        var $portChart = $('.portContainer');
        createChart($portChart, port_name, chartData);
        $portChart.fadeIn(500);
    }
}

function refreshTable($showTable) {

    var $realTable = $showTable.closest('.dataTables_scroll');
    $realTable.hide();
    $realTable.fadeIn('fast');
}
