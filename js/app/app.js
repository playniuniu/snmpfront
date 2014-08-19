$(function() {
//    var portDetailUrl = 'http://idcapi.uunus.com/billing?where={'
//        + '"dev_name":"' + 's9312-254' + '",'
//        + '"port_name":"' + 'Ethernet2/0/0' + '",'
//        + '"month":"' + '201408' + '",'
//        + '"datetype":"' + 'month' + '"}';
//
//    ajaxGetData(portDetailUrl, ajaxGenerateChart, ajaxFailedCallback);

    generateDeviceTable();
});

// Get Ajax data from post value
function ajaxGetData(url, callbackFunc, failedFunc) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
//        cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: false
        },
        beforeSend: ajaxStartRequest,
        success: callbackFunc,
        error: failedFunc,
        timeout: 5000
    });
}

// Process ajax failed callback
function ajaxFailedCallback(request) {
    $.notifyBar({
        html: "请求数据: " + this.url + " 失败!",
        cssClass: "error",
        delay: 3000
    });
}

function ajaxStartRequest(request) {
    $.notifyBar({
        html: "正在更新数据",
        delay: 1000,
        position: "bottom"
    });
}
