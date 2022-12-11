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

    var data = {"OkPercent": 91.70237631476432, "KoPercent": 8.297623685235683};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4930906639703404, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.2525, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.6149532710280374, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.6224299065420561, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.9766666666666667, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.06833333333333333, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.9808333333333333, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.9875, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.6140186915887851, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.6158878504672897, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.9990654205607477, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.5560747663551402, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.4841666666666667, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.4841666666666667, 500, 1500, "Find Flights"], "isController": true}, {"data": [0.4712351945854484, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.10490693739424704, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.06833333333333333, 500, 1500, "Purchase"], "isController": true}, {"data": [0.33248730964467005, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.4306260575296108, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.2986463620981388, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.338409475465313, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.2525, 500, 1500, "Choose Flight"], "isController": true}, {"data": [0.25510204081632654, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.25736961451247165, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.2585034013605442, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.26077097505668934, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.9988662131519275, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.20294784580498867, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15402, 1278, 8.297623685235683, 3573.739384495516, 59, 30097, 663.0, 10508.0, 12996.499999999956, 20889.97, 79.18888209072634, 2345.084552236024, 93.86802780859087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 600, 30, 5.0, 9523.06166666667, 1606, 30097, 8900.5, 15659.799999999997, 17268.949999999997, 20490.2, 17.86405454491321, 4918.958105768228, 62.722486564742304], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 600, 182, 30.333333333333332, 7189.721666666671, 623, 21515, 1471.5, 20779.2, 20959.95, 21347.5, 6.076503174972909, 478.0686004768789, 24.100347199365004], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 600, 0, 0.0, 453.9899999999998, 335, 4494, 396.5, 540.6999999999999, 638.5999999999995, 1493.3700000000006, 9.352349777881692, 66.82741017847401, 6.420607318213701], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 535, 71, 13.271028037383177, 3505.0953271028034, 251, 10796, 388.0, 10451.2, 10565.4, 10681.76, 5.43909233240479, 0.9556138930684615, 4.020891499639088], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 535, 74, 13.83177570093458, 3480.0317757009348, 253, 10762, 388.0, 10485.0, 10583.8, 10698.279999999999, 5.445403468772901, 0.9669905017150476, 4.025557056504967], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 600, 0, 0.0, 318.81000000000034, 252, 10463, 268.0, 381.9, 436.74999999999966, 1118.3100000000006, 8.081896551724139, 10.69720038052263, 5.954005800444505], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 600, 0, 0.0, 322.6549999999999, 249, 10369, 267.0, 384.0, 435.59999999999945, 965.3700000000006, 8.092142529603755, 24.740830169530387, 5.965953153238206], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 600, 0, 0.0, 76.20333333333333, 59, 294, 64.0, 124.0, 125.0, 289.99, 9.389083625438158, 13.492269043213257, 6.750696112528167], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 600, 337, 56.166666666666664, 13817.941666666673, 624, 21870, 14187.5, 21004.7, 21104.9, 21380.9, 4.317665006764342, 52.2985185236824, 15.265257829815637], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 600, 0, 0.0, 319.22166666666686, 250, 10172, 267.0, 384.0, 436.89999999999986, 1044.6700000000003, 8.113809704116406, 6.33977222592227, 5.967413862612918], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 600, 1, 0.16666666666666666, 310.5866666666666, 249, 10444, 267.0, 378.9, 390.94999999999993, 841.4500000000005, 8.084074373484237, 2.0989778066895717, 5.960373298976017], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 535, 79, 14.766355140186915, 3462.392523364486, 253, 10766, 388.0, 10480.6, 10568.2, 10715.199999999999, 5.439037036283969, 0.9630701457865254, 4.02085062154977], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 535, 80, 14.953271028037383, 3527.837383177569, 253, 10855, 388.0, 10456.8, 10532.0, 10686.88, 5.662813836318219, 1.0031069398577417, 4.17521918595728], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 535, 0, 0.0, 233.1158878504671, 62, 596, 287.0, 295.0, 297.0, 309.67999999999984, 6.085077343039126, 492.54650223569723, 4.086356471081665], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 535, 0, 0.0, 3027.2336448598126, 353, 10838, 525.0, 10368.0, 10501.8, 10680.28, 6.075127180232559, 39.83835841334144, 4.449556040209393], "isController": false}, {"data": ["Test", 600, 30, 5.0, 9523.064999999997, 1606, 30097, 8900.5, 15659.799999999997, 17268.949999999997, 20490.2, 17.81948858067773, 4906.68664127699, 62.56601099610941], "isController": true}, {"data": ["https://blazedemo.com/reserve.php", 600, 1, 0.16666666666666666, 807.2499999999999, 602, 14959, 684.0, 1010.4999999999999, 1319.0, 2146.51, 8.04073974805682, 112.60675181335432, 34.9952388979161], "isController": false}, {"data": ["Find Flights", 600, 1, 0.16666666666666666, 807.2499999999999, 602, 14959, 684.0, 1010.4999999999999, 1319.0, 2146.51, 13.105014852350166, 183.52952604212172, 57.03618571034641], "isController": true}, {"data": ["https://blazedemo.com/-5", 591, 5, 0.8460236886632826, 1913.7309644670058, 267, 18425, 813.0, 4492.200000000001, 7677.599999999988, 14558.760000000037, 28.45998266396995, 112.59870024920544, 16.948057371424444], "isController": false}, {"data": ["https://blazedemo.com/-4", 591, 5, 0.8460236886632826, 5298.490693739423, 564, 21027, 3744.0, 11855.000000000002, 14808.6, 19224.080000000005, 26.66486193827829, 3273.5614869551973, 15.827415093169101], "isController": false}, {"data": ["Purchase", 600, 337, 56.166666666666664, 13817.941666666675, 624, 21870, 14187.5, 21004.7, 21104.9, 21380.9, 5.052886882705653, 61.20402991414303, 17.864660859180255], "isController": true}, {"data": ["https://blazedemo.com/-3", 591, 9, 1.5228426395939085, 2708.9153976311327, 336, 16752, 1145.0, 7562.400000000001, 11607.599999999997, 15925.560000000003, 29.735849056603772, 1130.2063679245282, 17.558372641509433], "isController": false}, {"data": ["https://blazedemo.com/-2", 591, 4, 0.676818950930626, 1979.372250423011, 315, 21505, 859.0, 5008.6, 8422.599999999984, 15173.00000000001, 27.481980934666357, 772.9724918623576, 16.31361166007905], "isController": false}, {"data": ["https://blazedemo.com/-1", 591, 0, 0.0, 3622.8680203045665, 274, 27816, 1830.0, 10373.200000000008, 13403.599999999999, 17288.080000000016, 18.143304475962424, 1487.9990200198013, 11.180102660480753], "isController": false}, {"data": ["https://blazedemo.com/-0", 591, 0, 0.0, 2038.5448392554983, 543, 16691, 1008.0, 4688.400000000015, 7518.999999999998, 13424.00000000001, 29.937693125981458, 139.07578730497443, 17.220020753128008], "isController": false}, {"data": ["Choose Flight", 600, 182, 30.333333333333332, 7189.721666666671, 623, 21515, 1471.5, 20779.2, 20959.95, 21347.5, 6.283512064343164, 494.3550150771563, 24.921376328046456], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-5", 441, 104, 23.582766439909296, 7128.340136054428, 250, 10822, 10020.0, 10513.8, 10586.0, 10738.3, 3.182231458630991, 0.570954549923511, 2.352489466976231], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 441, 88, 19.954648526077097, 6984.773242630378, 256, 11336, 9581.0, 10536.8, 10619.5, 10784.16, 3.182369241427087, 0.5717826431885753, 2.3525913239846727], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 441, 99, 22.448979591836736, 6895.362811791385, 252, 10847, 9511.0, 10563.6, 10630.8, 10762.44, 3.1851274050962037, 0.5725814970098805, 2.354630318025221], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 441, 109, 24.71655328798186, 6997.199546485258, 257, 10840, 10007.0, 10548.8, 10620.8, 10781.58, 3.182598905936521, 0.5746641041092332, 2.3465450917793684], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 441, 0, 0.0, 124.61224489795923, 59, 1141, 123.0, 282.40000000000003, 292.0, 297.15999999999997, 3.1883974145784233, 32.01548254786211, 2.276064053078503], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 441, 0, 0.0, 7150.596371882079, 354, 10896, 9704.0, 10557.8, 10614.3, 10714.9, 3.182369241427087, 17.962982632273988, 2.669585135142449], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.0782472613458529, 0.006492663290481756], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 31, 2.4256651017214397, 0.20127256200493443], "isController": false}, {"data": ["429/Too Many Requests", 929, 72.69170579029733, 6.031684196857551], "isController": false}, {"data": ["Assertion failed", 317, 24.80438184663537, 2.0581742630827167], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15402, 1278, "429/Too Many Requests", 929, "Assertion failed", 317, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 31, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://blazedemo.com/", 600, 30, "Assertion failed", 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 600, 182, "Assertion failed", 117, "429/Too Many Requests", 65, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 535, 71, "429/Too Many Requests", 71, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 535, 74, "429/Too Many Requests", 74, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 600, 337, "Assertion failed", 178, "429/Too Many Requests", 159, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 600, 1, "429/Too Many Requests", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 535, 79, "429/Too Many Requests", 79, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 535, 80, "429/Too Many Requests", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 600, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/-5", 591, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-4", 591, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/-3", 591, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-2", 591, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 441, 104, "429/Too Many Requests", 104, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 441, 88, "429/Too Many Requests", 88, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 441, 99, "429/Too Many Requests", 99, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 441, 109, "429/Too Many Requests", 109, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
