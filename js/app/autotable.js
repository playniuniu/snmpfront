// generate device table
function generateDeviceTable() {
    var deviceUrl = 'http://idcapi.uunus.com/devices/';
    ajaxGetData(deviceUrl, ajaxCreateDevicesList, ajaxFailedCallback);
}

// Process ajax success callback
function ajaxCreateDevicesList(response) {
    var deviceData = response['data'];
    var $deviceInput = $('#deviceInput');
    createDeviceList($deviceInput, deviceData);
}


// create device list with tAutocomplete table
function createDeviceList($inputTextBox, deviceData) {

    var tableData = [];

    for(var i = 0; i < deviceData.length; i++) {
        var item = {
            'id': deviceData[i]['dev_name'],
            'dev_name': deviceData[i]['dev_name'],
            'ip': deviceData[i]['ip'],
            'sys_name': deviceData[i]['sys_name']
        };
        tableData.push(item);
    }

    var inputTable = $inputTextBox.tautocomplete({
        width: "500px",
        columns: ['设备名称', 'IP', 'SNMP名称'],
        placeholder: "输入设备型号",
        regex: "^[a-zA-Z0-9\-\._\b]+$",
        data: function () {
            try {
                var data = tableData;
            }
            catch(e)
            {
                alert(e)
            }
            var filterData = [];
            var searchData = eval("/" + inputTable.searchdata() + "/gi");
            $.each(data, function(i,v)
            {
                if (v.dev_name.search(new RegExp(searchData)) != -1) {
                    filterData.push(v);
                }
                if (v.ip.search(new RegExp(searchData)) != -1) {
                    if (filterData.indexOf(v) === -1) {
                        filterData.push(v);
                    }
                }
                if (v.sys_name.search(new RegExp(searchData)) != -1) {
                    if (filterData.indexOf(v) === -1) {
                        filterData.push(v);
                    }
                }
            });
            return filterData;
        },
        onchange: function() {
            $inputTextBox.data('dev_name', inputTable.id());
            generatePortList();
        }
    });
}

// generate port input table
function generatePortList() {
    var $deviceInput = $('#deviceInput');
    var dev_name = $deviceInput.data('dev_name');
    if(dev_name != undefined && dev_name != "") {
        var portUrl = 'http://idcapi.uunus.com/ports/' + dev_name;
        ajaxGetData(portUrl, ajaxCreatePortList, ajaxFailedCallback);
    }

    else {
        var $portInput = recreatePortDOM();

        $portInput.on('focus', function () {
            $.notifyBar({
                cssClass: "error",
                html: "请先选择网络设备",
                delay: 2000
            });
        });
    }
}

// Process ajax success callback
function ajaxCreatePortList(response) {
    var portData = response['data'];
    var $portInput = recreatePortDOM();

    createPortList($portInput, portData);
}

// Recreate portInput DOM
function recreatePortDOM() {
    var $portInput = $('#portInput');
    var $portContainer = $portInput.closest('.search-box');
    $portContainer.empty();
    var $portInputClone = $('<input type="text" id="portInput" class="auto-input"/>');
    $portContainer.append($portInputClone);
    return $portInputClone;
}

// Create port list
function createPortList($inputTextBox, portData) {

    var tableData = [];

    for(var i = 0; i < portData.length; i++) {
        var item = {
            'id': portData[i]['ifDescr'],
            'ifDescr': portData[i]['ifDescr'].replace(/\//g,'-')
        };
        tableData.push(item);
    }

    var inputTable = $inputTextBox.tautocomplete({
        width: "500px",
        columns: ['端口名称'],
        placeholder: "输入端口名称，如2-0-0",
        regex: "^[a-zA-Z0-9\-\b]+$",
        data: function () {
            try {
                var data = tableData;
            }
            catch(e)
            {
                alert(e)
            }
            var filterData = [];

            // Because port contain 2/0/0 str, need to replace with 2\/0\/0 to reg search
            // var replaceSearchData = inputTable.searchdata().replace(/\//g,'\\/');

            var searchData = eval("/" + inputTable.searchdata() + "/gi");

            $.each(data, function(i,v)
            {
                if (v.ifDescr.search(new RegExp(searchData)) != -1) {
                    filterData.push(v);
                }
            });
            return filterData;
        },
        onchange: function() {
            $inputTextBox.data('port_name', inputTable.id());
            generateDateList();
        }
    });
}

// genearte date input table
function generateDateList() {
    var $portInput = $('#portInput');
    var port_name = $portInput.data('port_name');
    var $dateInput = $('#dateInput');

    if(port_name == undefined || port_name == "") {
        $dateInput.on('focus', function () {
            $.notifyBar({
                cssClass: "error",
                html: "请先选择端口",
                delay: 2000
            });
        });
        return;
    }

    var month = '201408';
    $dateInput.val('201408');

    var $deviceInput = $('#deviceInput');
    var dev_name = $deviceInput.data('dev_name');

    var portChartUrl = 'http://idcapi.uunus.com/billing?where={'
        + '"dev_name":"' + dev_name + '",'
        + '"port_name":"' + port_name + '",'
        + '"month":"' + month + '",'
        + '"datetype":"' + 'all' + '",'
        + '"billing_method":"' + '95th' + '"}';

    ajaxGetData(portChartUrl, ajaxGeneratePortArea, ajaxFailedCallback);
}

function ajaxGeneratePortArea(response) {

    if(response['error'] == 'true') {
        $.notifyBar({
            cssClass: "error",
            html: "换取端口数据错误",
            delay: 2000
        });
        return;
    }

    var $showArea = $('.showArea');
    var month_data = response['data']['month'];
    var allday_data = response['data']['allday'];
    $showArea.data('month_data', month_data);
    $showArea.data('allday_data', allday_data);
    $showArea.data('status','on');
    registerUiEvent($showArea);
    generateAreaChart($showArea);

}

function registerUiEvent($showArea) {
    var $chartButtonGroup = $showArea.closest('.port-billing-area').find('.area-button');

    $chartButtonGroup.on('click', '.chart-button', function() {
        generateAreaChart($showArea);
        $(this).blur();
    });

    $chartButtonGroup.on('click', '.data-button', function() {
        generateAreaTable($showArea);
    });

    $chartButtonGroup.on('click', '.export-button', function() {
        generateAreaExport($showArea);
    });
}
