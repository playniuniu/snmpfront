Highcharts.theme = {
    global: {
        useUTC: false
    },

    lang : {
        months: ['1月', '2月', '3月', '4月', '5月', '6月',  '7月', '8月', '9月', '10月', '11月', '12月'],
        shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月',  '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        rangeSelectorZoom: '选择时间',
        rangeSelectorFrom: '开始时间',
        rangeSelectorTo: '结束时间'
    },

    colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],

    chart: {
        backgroundColor: null,
        style: {
            fontFamily: "Hiragino Sans GB, Microsoft YaHei, sans-serif"
        }
    },

    tooltip: {
        borderWidth: 0,
        borderRadius: 10,

        formatter: function() {
            var format_str = '<b>'+ Highcharts.dateFormat('%Y年 %b %e日, %H:%M', this.x) +'</b>';
            $.each(this.points, function(i, point) {
                format_str += '<br/>';
                format_str += '<span style="color:' + this.series.color + '">';
                format_str += this.series.name;
                format_str += ' : ';
                format_str += '</span>';
                format_str += transSpeed(point.y);
            });

            return format_str;

            function transSpeed(value) {

                var speed_str = '';
                if (value < 1000) {
                    speed_str += value.toFixed(1);
                    speed_str += ' bps';
                    return speed_str;
                }

                if (value < Math.pow(1000,2)) {
                    speed_str += (value / 1000).toFixed(1);
                    speed_str += ' kbps';
                    return speed_str;
                }

                if (value < Math.pow(1000,3)) {
                    speed_str += (value / Math.pow(1000,2)).toFixed(1);
                    speed_str += ' Mbps';
                    return speed_str;
                }

                speed_str += (value / Math.pow(1000,3)).toFixed(1);
                speed_str += ' Gbps';
                return speed_str;
            }
        }
    },

    yAxis : {
        min: 0,
        labels:{
            align:'left'
        }
    },

    plotOptions: {
        series: {
            shadow: true
        }
    },

    rangeSelector: {
        buttons: [{
            type: 'minute',
            count: 60,
            text: '1h'
        }, {
            type: 'minute',
            count: 720,
            text: '12h'
        }, {
            type: 'day',
            count: 1,
            text: '1d'
        }, {
            type: 'week',
            count: 1,
            text: '1w'
        }, {
            type: 'month',
            count: 1,
            text: '1m'
        }, {
            type: 'all',
            text: 'All'
        }],

        buttonTheme: {
            fill: 'none',
            stroke: 'none',
            'stroke-width': 0,
            r: 8,
            style: {
                color: '#039',
                fontWeight: 'bold'
            },
            states: {
                select: {
                    fill: '#039',
                    style: {
                        color: 'white'
                    }
                }
            }
        },

        inputBoxBorderColor: '#F5F5F5',
        inputBoxWidth: 90,
        inputBoxHeight: 18,
        inputStyle: {
            color: '#039',
            fontWeight: 'bold'
        },

        labelStyle: {
            color: 'silver',
            fontWeight: 'bold'
        },

        selected: 1
    },

    scrollbar: {
        trackBorderColor: '#C0C0C8'
    },

    exporting: {
        enabled: false
    }
};

// Add the background image to the container
Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
    proceed.call(this);
    this.container.style.background = 'url(images/sand.png)';
});

// Apply the theme
Highcharts.setOptions(Highcharts.theme);