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
            var searchData = eval("/" + inputTable.searchdata() + "/g");
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
            generatePortList(inputTable.id());
        }
    });
}

function generatePortList(dev_name) {
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
    var $portInputClone = $portInput.clone();
    var $portContainer = $portInput.closest('.search-box');
    $portContainer.empty();
    $portInputClone.val("");
    $portContainer.append($portInputClone);
    return $portInputClone;
}


// Create port list
function createPortList($inputTextBox, portData) {

    var tableData = [];

    for(var i = 0; i < portData.length; i++) {
        var item = {
            'id': portData[i]['ifDescr'],
            'ifDescr': portData[i]['ifDescr']
        };
        tableData.push(item);
    }

    var inputTable = $inputTextBox.tautocomplete({
        width: "500px",
        columns: ['端口名称'],
        placeholder: "输入端口名称，如2/0/0",
        regex: "^[a-zA-Z0-9\/\b]+$",
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
            var replaceSearchData = inputTable.searchdata().replace(/\//g,'\\/');

            var searchData = eval("/" + replaceSearchData + "/g");
            $.each(data, function(i,v)
            {
                if (v.ifDescr.search(new RegExp(searchData)) != -1) {
                    filterData.push(v);
                }
            });
            return filterData;
        },
        onchange: function() {
            generateDataList(inputTable.id());
        }
    });
}

function generateDataList(port_name) {
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
    $dateInput.val('八月');

    var $deviceContainer = $('#deviceInput').closest('.acontainer');
    var dev_name = $deviceContainer.children('input').last().val();
    createPortChart(dev_name, port_name, '201408');
}
