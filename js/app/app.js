$(function() {
//    var portDetailUrl = 'http://idcapi.uunus.com/billing?where={'
//        + '"dev_name":"' + 's9312-254' + '",'
//        + '"port_name":"' + 'Ethernet2/0/0' + '",'
//        + '"month":"' + '201408' + '",'
//        + '"datetype":"' + 'month' + '"}';
//
//    ajaxGetData(portDetailUrl, ajaxGenerateChart, ajaxFailedCallback);

    getDeviceTable();
});

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
