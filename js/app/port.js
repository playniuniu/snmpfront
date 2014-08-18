// Generate chart data from ajax request
function generateIfData(data) {

    var items = data['_items'];
    if(items.length == 0) {
        console.log('generateIfData params error!');
        return undefined;
    }

    var ifHCInOctets = [],
        ifHCOutOctets = [],
        timeStamp = [];

    for(var i = 0; i < items.length; i++) {
        ifHCInOctets  = ifHCInOctets.concat(items[i]['ifHCInOctets']);
        ifHCOutOctets = ifHCOutOctets.concat(items[i]['ifHCOutOctets']);
        timeStamp  = timeStamp.concat(items[i]['timestamp']);
    }

    return {
        'ifInData' : countTraffic(ifHCInOctets, timeStamp),
        'ifOutData' : countTraffic(ifHCOutOctets, timeStamp)
    }
}


// Count traffic value from ifHCInOctets/ifHCOutOctets data
function countTraffic(trafficData, timeData) {
    if( trafficData.length <= 1 || trafficData.length != timeData.length ) {
        console.log('Traffic data params error!');
        return undefined;
    }

    var trafficList = [],
        trafficNow = 0,
        trafficLast = 0,
        trafficResult = 0,
        diffTime = 0;

    for(var i = 1; i < trafficData.length; i++ ) {

        trafficNow = trafficData[i];
        trafficLast = trafficData[i-1];
        diffTime = timeData[i] - timeData[i-1];

        if (trafficNow - trafficLast >= 0) {
            // diffTraffic is in Byte unit so need to * 8 and / time interval
            trafficResult = (trafficNow -  trafficLast) * 8 / diffTime;
            trafficList.push([timeData[i]*1000, trafficResult]);
        }
        else {
            // If traffic data is overflow here
            // Check it's 32 bit traffic or 64 bit traffic
            var max_traffic = trafficLast > Math.pow(2,32) ? Math.pow(2, 64) : Math.pow(2, 32);
            trafficResult = (max_traffic - trafficLast + trafficNow) * 8 / diffTime;
            trafficList.push([timeData[i]*1000, trafficResult]);
        }
    }

    return trafficList;
}
