$(function() {
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

function transSpeed(value) {

    var speed_str = '';
    if (value < 1000) {
        speed_str += value.toFixed(0);
        speed_str += ' bps';
        return speed_str;
    }

    if (value < Math.pow(1000,2)) {
        speed_str += (value / 1000).toFixed(1);
        speed_str += ' kb';
        return speed_str;
    }

    if (value < Math.pow(1000,3)) {
        speed_str += (value / Math.pow(1000,2)).toFixed(1);
        speed_str += ' Mb';
        return speed_str;
    }

    speed_str += (value / Math.pow(1000,3)).toFixed(1);
    speed_str += ' Gb';
    return speed_str;
}
