/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.02790279027903, "KoPercent": 0.9720972097209721};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6730920535011802, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0275, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.38125, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9624060150375939, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.8866498740554156, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.8740554156171285, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.9962406015037594, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.9874686716791979, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.26125, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.993734335839599, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.8753148614609572, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.8778337531486146, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.7795969773299748, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.0275, 500, 1500, "Test"], "isController": true}, {"data": [0.49, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.49, 500, 1500, "Find Flights"], "isController": true}, {"data": [0.73875, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.335, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.26125, 500, 1500, "Purchase"], "isController": true}, {"data": [0.50125, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.57375, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.65125, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.45875, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.38125, 500, 1500, "Choose Flight"], "isController": true}, {"data": [0.7634961439588689, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.7557840616966581, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.7776349614395887, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.7583547557840618, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.7146529562982005, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11110, 108, 0.9720972097209721, 1005.3696669666933, 57, 18165, 386.0, 2447.7999999999993, 4172.799999999996, 10526.89, 56.00955842689265, 1552.2694174451374, 67.22495970059336], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 400, 0, 0.0, 2541.7424999999994, 1281, 9762, 2339.0, 3733.7000000000003, 4230.849999999999, 5852.180000000006, 30.349013657056148, 8536.876126232928, 108.88894157814872], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 400, 17, 4.25, 2492.8399999999983, 616, 15343, 862.0, 8406.600000000004, 11014.9, 14796.900000000003, 4.934007647711853, 436.1014087940977, 21.370794047582336], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 399, 0, 0.0, 408.1679197994987, 342, 1599, 373.0, 476.0, 530.0, 1157.0, 8.283679697718355, 59.19109799629414, 5.686940261226566], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 397, 5, 1.2594458438287153, 823.5717884130976, 256, 10750, 368.0, 1128.5999999999976, 4314.799999999999, 10574.2, 5.394754722108982, 0.9244101610273134, 3.9881145748403313], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 397, 3, 0.7556675062972292, 814.7103274559194, 253, 10520, 366.0, 2084.999999999999, 4147.299999999992, 10396.34, 4.983492964111319, 0.8627407406826256, 3.6840861072580746], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 399, 0, 0.0, 274.9423558897243, 252, 748, 267.0, 279.0, 314.0, 468.0, 8.284023668639053, 1.4238976694695318, 6.124029215976331], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 399, 0, 0.0, 309.43358395989975, 251, 8894, 266.0, 280.0, 317.0, 902.0, 7.3359073359073355, 1.2680948646350432, 5.423126809845559], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 399, 0, 0.0, 63.19799498746869, 59, 124, 63.0, 64.0, 65.0, 119.0, 8.336467343612886, 1.7421914175128494, 5.999976984612009], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 400, 41, 10.25, 4113.5825, 611, 18165, 975.0, 10881.9, 12778.649999999996, 15222.090000000004, 2.596273050036672, 18.661435142665205, 11.455085034027404], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 399, 0, 0.0, 291.05513784461164, 252, 5304, 266.0, 282.0, 369.0, 603.0, 8.299704622041022, 1.4265117319133005, 6.11941112269626], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 399, 0, 0.0, 275.56390977443635, 255, 751, 266.0, 280.0, 319.0, 510.0, 8.299531981279252, 1.4185395540821633, 6.13549385725429], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 397, 3, 0.7556675062972292, 814.5793450881616, 251, 10576, 370.0, 1133.3999999999965, 4165.499999999999, 10417.939999999999, 5.293827423892896, 0.9112829697438428, 3.9135032811395734], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 397, 5, 1.2594458438287153, 791.6801007556676, 254, 10740, 361.0, 1564.7999999999997, 4119.4, 10476.32, 4.920308355848598, 0.8479049959100711, 3.6277664147125894], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 397, 0, 0.0, 220.6372795969774, 103, 300, 276.0, 291.0, 293.0, 296.02, 5.632723712773656, 460.79420451079017, 3.7796783219945804], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 397, 0, 0.0, 924.801007556675, 345, 10866, 472.0, 2005.6, 4167.499999999999, 9771.679999999986, 5.611624685494586, 36.79888648739858, 4.110076673946231], "isController": false}, {"data": ["Test", 400, 0, 0.0, 2541.7424999999994, 1281, 9762, 2339.0, 3733.7000000000003, 4230.849999999999, 5852.180000000006, 30.159089195506294, 8483.452261460454, 108.20751338309583], "isController": true}, {"data": ["https://blazedemo.com/reserve.php", 400, 1, 0.25, 770.3700000000001, 609, 10657, 651.0, 814.2000000000003, 1004.6999999999999, 5073.69000000003, 6.951081762099227, 55.7646631169085, 30.25208871861152], "isController": false}, {"data": ["Find Flights", 400, 1, 0.25, 770.3700000000001, 609, 10657, 651.0, 814.2000000000003, 1004.6999999999999, 5073.69000000003, 20.04008016032064, 160.7704177887024, 87.21725677918336], "isController": true}, {"data": ["https://blazedemo.com/-5", 400, 0, 0.0, 701.0099999999999, 269, 4679, 487.0, 1380.9000000000003, 1681.0, 2704.94, 35.3076176185012, 140.2305477094183, 21.205258628299056], "isController": false}, {"data": ["https://blazedemo.com/-4", 400, 0, 0.0, 1472.1224999999997, 601, 9204, 1223.5, 2500.7000000000003, 3080.7499999999995, 3975.800000000001, 32.586558044806516, 4034.082548370672, 19.507382892057027], "isController": false}, {"data": ["Purchase", 400, 41, 10.25, 4113.5825, 611, 18165, 975.0, 10881.9, 12778.649999999996, 15222.090000000004, 4.928354052955164, 35.42391641665537, 21.744521345163438], "isController": true}, {"data": ["https://blazedemo.com/-3", 400, 0, 0.0, 895.8800000000001, 350, 4961, 702.5, 1719.6000000000004, 1964.6499999999996, 2913.6100000000006, 34.74333362286111, 1339.7904814123165, 20.832428559020236], "isController": false}, {"data": ["https://blazedemo.com/-2", 400, 0, 0.0, 777.7625000000002, 319, 3471, 589.5, 1622.7000000000005, 1891.9, 2714.4800000000014, 34.73729917498915, 983.1266283108988, 20.760963960052106], "isController": false}, {"data": ["https://blazedemo.com/-1", 400, 0, 0.0, 732.6875000000006, 273, 3234, 584.0, 1337.4000000000005, 1805.6999999999998, 2570.2900000000036, 35.273368606701936, 2892.864032186949, 21.73583553791887], "isController": false}, {"data": ["https://blazedemo.com/-0", 400, 0, 0.0, 834.5299999999995, 474, 4059, 657.5, 1461.7, 1743.35, 2207.6500000000015, 33.436428989383934, 155.32919209228456, 19.232477221432752], "isController": false}, {"data": ["Choose Flight", 400, 17, 4.25, 2492.8399999999983, 616, 15343, 862.0, 8406.600000000004, 11014.9, 14796.900000000003, 5.602319360215129, 495.1713779035771, 24.265469732594294], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-5", 389, 9, 2.3136246786632393, 1297.7455012853466, 250, 10668, 371.0, 4033.0, 4580.0, 10460.400000000001, 2.531003162127344, 0.43466034783400787, 1.8710638610648433], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 389, 9, 2.3136246786632393, 1381.1696658097676, 252, 10669, 371.0, 4106.0, 4687.0, 10541.2, 2.531365505752512, 0.4395776800588266, 1.871331726420558], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 389, 11, 2.827763496143959, 1374.516709511569, 249, 10786, 369.0, 4261.0, 7627.5, 10565.3, 2.5330963032422327, 0.4378941683434592, 1.8726112319866897], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 389, 4, 1.0282776349614395, 1295.303341902313, 252, 10522, 373.0, 4103.0, 4455.0, 10488.300000000001, 2.5312337324310255, 0.43597084851639767, 1.8662904960795157], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 389, 0, 0.0, 94.88431876606688, 57, 294, 116.0, 125.0, 125.0, 221.30000000000143, 2.535440769105426, 2.6626023504969853, 1.823551053038944], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 389, 0, 0.0, 1359.727506426735, 344, 10575, 471.0, 4134.0, 4744.0, 9866.900000000016, 2.5312666744752015, 14.287813846158851, 2.12339655602949], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 64, 59.25925925925926, 0.5760576057605761], "isController": false}, {"data": ["Assertion failed", 44, 40.74074074074074, 0.39603960396039606], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11110, 108, "429/Too Many Requests", 64, "Assertion failed", 44, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 400, 17, "Assertion failed", 14, "429/Too Many Requests", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 397, 5, "429/Too Many Requests", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 397, 3, "429/Too Many Requests", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 400, 41, "Assertion failed", 30, "429/Too Many Requests", 11, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 397, 3, "429/Too Many Requests", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 397, 5, "429/Too Many Requests", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 400, 1, "429/Too Many Requests", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 389, 9, "429/Too Many Requests", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 389, 9, "429/Too Many Requests", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 389, 11, "429/Too Many Requests", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 389, 4, "429/Too Many Requests", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
