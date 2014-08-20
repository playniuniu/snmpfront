// Generate area chart
function generateAreaTable($showArea) {
    var allday_data = $showArea.data('allday_data');
    if(allday_data == undefined || allday_data == "") {
        $.notifyBar({
            cssClass: "error",
            html: "端口表格数据生成错误",
            delay: 2000
        });
        return;
    }

    var tableData = parseAllDayData(allday_data);
    var $table = $('<table class="display" cellspacing="0" width="100%">');
    $showArea.empty();
    $showArea.append($table);

    $table.dataTable({
        "info" : false,
        "paging": false,
        "destroy": true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "data": tableData,
        "columns": [
            { "title": "日期" },
            { "title": "95th ( 入 / 出 )"},
            { "title": "平均值 ( 入 / 出 )"},
            { "title": "最大值 ( 入 / 出 )"},
            { "title": "最小值 ( 入 / 出 )"}
        ]
    });
}

// parse all day data
function parseAllDayData(raw_data) {

    var table_data = [],
        date, avrg, min, max, billing_95th;

    for(var i = 0; i < raw_data.length; i++) {
        date = raw_data[i]['date_type'];
        avrg = transSpeed(raw_data[i]['ifIn_avrg']) + ' / ' + transSpeed(raw_data[i]['ifOut_avrg']);
        min = transSpeed(raw_data[i]['ifIn_min']) + ' / ' + transSpeed(raw_data[i]['ifOut_min']);
        max = transSpeed(raw_data[i]['ifIn_max']) + ' / ' + transSpeed(raw_data[i]['ifOut_max']);
        billing_95th = transSpeed(raw_data[i]['ifIn_95th']) + ' / ' + transSpeed(raw_data[i]['ifOut_95th']);
        table_data.push([date, billing_95th, avrg, max, min]);
    }

    return table_data;
}
