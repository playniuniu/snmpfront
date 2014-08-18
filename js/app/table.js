function getDeviceTable() {
    var deviceUrl = 'http://idcapi.uunus.com/devices/';
    ajaxGetData(deviceUrl, ajaxCreateDevicesTable, ajaxFailedCallback);
}


// Process ajax success callback
function ajaxCreateDevicesTable(response) {
    var deviceData = response['data'];
    var $deviceTable = $('#deviceTable');
    var active_class = 'selected';

    createDeviceTable($deviceTable, deviceData, active_class);
    onFoucsInput($deviceTable);
}

function onFoucsInput($table) {
    var $floatTable = $table.closest('.floatTable');
    var $header = $table.closest('.floatTable').find('th');
    var $input = $floatTable.closest('.search-box').find('.search-box-input');

    $input.on('focus', function() {
        // Fix dataTable header bug
        $floatTable.fadeIn(500);
        $header.click();
    });
}

// create device table
function createDeviceTable($deviceTable, deviceData, active_class) {

    var tableData = [];

    for(var i = 0; i < deviceData.length; i++) {
        var dev_name = deviceData[i]['dev_name'];
        var ip = deviceData[i]['ip'];
        var sys_name = deviceData[i]['sys_name'];
        tableData.push([dev_name, ip, sys_name]);
    }

    $deviceTable.dataTable({
        "info" : false,
        "paging": false,
        "destroy": true,
        "scrollY": "400px",
        "scrollCollapse": true,
        "data": tableData,
        "columns": [
            { "title": "设备名称", "class": "center" },
            { "title": "IP地址", "class": "center" },
            { "title": "SYS Name", "class": "center" }
        ]
    });

    registerFilter($deviceTable, active_class);
    registerTableClick($deviceTable, active_class);
}

// listen on click device table
function registerTableClick($table, active_class) {
    $table.children('tbody').on('click', 'tr', function () {

        // Check if it is already selected
        if($(this).hasClass(active_class)) {
            return;
        }

        $(this).siblings().removeClass(active_class);
        $(this).addClass(active_class);
        var device_name = $('td', this).eq(0).text();

        var $realTable = $table.closest('.floatTable');

        $realTable.hide();

        var $input = $table.closest('.search-box').find('.search-box-input');
        var $control = $table.closest('.toolbar-control');
        $control.children().hide();
        $control.append('<label>' + device_name + '</label>');
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
function registerFilter($filterTable, active_class) {

    var $input = $filterTable.closest('.search-box').find('.search-box-input');
    var $allTableRows = $filterTable.find('tr');

    $input.focus(function() {
        // remove all selected class
        $allTableRows.removeClass(active_class);

        // clear input text
        $(this).val('');

        // clear filter vaule
        $filterTable.fnFilter('');

//        if($filterTable.attr('id') == 'deviceTable') {
//
//            var $realTable = $('#portTable').closest('.dataTables_scroll');
//
//            if($realTable.is(":visible")) {
//                $realTable.fadeOut('fast');
//            }
//
//        }
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
                $(firstRow).addClass(active_class);
            }
        }

        // when press delete, clean select success
        if(e.keyCode == 8) {
            $allTableRows.removeClass(active_class);
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
