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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8320833333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45666666666666667, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.49666666666666665, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9383333333333334, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.49, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.8316666666666667, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.45666666666666667, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.5, 500, 1500, "Find Flights"], "isController": true}, {"data": [0.9983333333333333, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.49, 500, 1500, "Purchase"], "isController": true}, {"data": [0.9016666666666666, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.9416666666666667, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.7833333333333333, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.49666666666666665, 500, 1500, "Choose Flight"], "isController": true}, {"data": [0.9966666666666667, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.995, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.8566666666666667, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8400, 0, 0.0, 421.29619047618894, 53, 2393, 367.0, 771.8000000000011, 943.0, 1331.0, 49.09122786511601, 1350.4815980947926, 58.98412388229793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 300, 0, 0.0, 1260.58, 981, 1839, 1222.5, 1487.7, 1603.8499999999997, 1774.6200000000003, 27.247956403269754, 7664.605685172571, 97.76268732970027], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 300, 0, 0.0, 843.1266666666669, 632, 2393, 864.0, 938.0, 988.8499999999999, 1481.3800000000006, 4.885436513752504, 436.0682108717248, 21.292678868044362], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 300, 0, 0.0, 423.14666666666625, 345, 805, 395.0, 528.5000000000002, 604.55, 745.7900000000002, 6.440394152122109, 46.02005444816556, 4.421481532169769], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 300, 0, 0.0, 321.6699999999999, 250, 434, 281.0, 388.0, 391.9, 428.83000000000015, 4.929508035098097, 0.84244522084196, 3.644177326727793], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 300, 0, 0.0, 322.98666666666657, 256, 435, 284.0, 386.0, 390.0, 425.97, 4.919565110444237, 0.8504185729981469, 3.6368269419983275], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 300, 0, 0.0, 267.7666666666663, 248, 299, 267.0, 276.0, 282.0, 286.99, 6.457723437230928, 1.1099212157740657, 4.773922501937316], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 300, 0, 0.0, 268.2933333333336, 252, 326, 267.0, 276.0, 282.0, 298.94000000000005, 6.45758443291646, 1.1162035592052866, 4.7738197419118755], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 300, 0, 0.0, 57.72000000000003, 53, 72, 58.0, 59.0, 60.0, 62.0, 6.485785320505891, 1.3617615663171547, 4.667991973840666], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 300, 0, 0.0, 830.9433333333333, 620, 1841, 851.5, 1014.3000000000006, 1175.6, 1620.5300000000004, 2.4137681334331025, 15.790915129900954, 10.894957336648242], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 300, 0, 0.0, 268.45000000000005, 254, 392, 268.0, 276.0, 281.0, 299.96000000000004, 6.457028475495577, 1.1098017692258024, 4.760797362303868], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 300, 0, 0.0, 269.16333333333336, 255, 480, 267.0, 277.0, 282.0, 305.9100000000001, 6.456611570247934, 1.1034248288997934, 4.773100545583678], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 300, 0, 0.0, 321.6600000000001, 252, 465, 283.0, 388.0, 391.0, 409.95000000000005, 4.920533385819023, 0.8457166756876445, 3.6375427471337893], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 300, 0, 0.0, 324.41666666666674, 256, 451, 358.0, 388.0, 390.95, 412.96000000000004, 4.91464893024475, 0.8447052848858163, 3.6235936936863142], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 300, 0, 0.0, 202.81333333333333, 96, 271, 251.0, 264.0, 265.0, 269.0, 4.931047518861257, 404.41331321192, 3.308232075642269], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 300, 0, 0.0, 492.50000000000017, 359, 2002, 479.5, 553.6000000000001, 636.5499999999997, 1093.4500000000005, 4.921663522270528, 32.274385304733, 3.604734025100484], "isController": false}, {"data": ["Test", 300, 0, 0.0, 1260.58, 981, 1839, 1222.5, 1487.7, 1603.8499999999997, 1774.6200000000003, 27.058717416794444, 7611.374456007035, 97.08371854424101], "isController": true}, {"data": ["https://blazedemo.com/reserve.php", 300, 0, 0.0, 699.6533333333329, 614, 1076, 672.0, 818.6000000000005, 890.2499999999998, 1018.95, 6.403688524590164, 51.50483345073429, 27.928586866034838], "isController": false}, {"data": ["Find Flights", 300, 0, 0.0, 699.6533333333329, 614, 1076, 672.0, 818.6000000000005, 890.2499999999998, 1018.95, 30.241935483870968, 243.23572958669354, 131.89500378024195], "isController": true}, {"data": ["https://blazedemo.com/-5", 300, 0, 0.0, 373.5933333333331, 261, 699, 386.0, 420.90000000000003, 440.84999999999997, 474.96000000000004, 30.293850348379276, 120.31747008482277, 18.19406051196607], "isController": false}, {"data": ["https://blazedemo.com/-4", 300, 0, 0.0, 730.1766666666668, 508, 1226, 717.5, 916.7000000000005, 969.8499999999999, 1014.7400000000002, 29.55082742316785, 3658.271230422577, 17.690094932033098], "isController": false}, {"data": ["Purchase", 300, 0, 0.0, 830.9433333333333, 620, 1841, 851.5, 1014.3000000000006, 1175.6, 1620.5300000000004, 4.884243430692585, 31.952809559278435, 22.04587220377064], "isController": true}, {"data": ["https://blazedemo.com/-3", 300, 0, 0.0, 464.7066666666664, 326, 860, 465.0, 605.9000000000001, 650.95, 732.6300000000003, 30.138637733574445, 1162.2212176009643, 18.071409734779987], "isController": false}, {"data": ["https://blazedemo.com/-2", 300, 0, 0.0, 433.9066666666669, 312, 943, 441.5, 531.5000000000005, 599.95, 669.8200000000002, 30.15984719010757, 853.5766908364332, 18.025221172212728], "isController": false}, {"data": ["https://blazedemo.com/-1", 300, 0, 0.0, 269.5466666666667, 247, 635, 264.0, 289.90000000000003, 312.95, 352.98, 30.6309985705534, 2512.1606659689605, 18.87515634572187], "isController": false}, {"data": ["https://blazedemo.com/-0", 300, 0, 0.0, 524.8333333333336, 449, 1084, 492.5, 609.0, 704.6499999999999, 976.2200000000007, 28.88781896966779, 134.1989648531536, 16.61613805970149], "isController": false}, {"data": ["Choose Flight", 300, 0, 0.0, 843.1266666666669, 632, 2393, 864.0, 938.0, 988.8499999999999, 1481.3800000000006, 6.360918516633802, 567.7679669444268, 27.72341732396158], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-5", 300, 0, 0.0, 312.2, 256, 835, 271.0, 385.0, 392.95, 456.6400000000003, 2.4254576030010995, 0.414538496054589, 1.7930384819060863], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 300, 0, 0.0, 311.8433333333335, 255, 687, 273.5, 386.0, 389.95, 397.98, 2.425222312045271, 0.41920346604688763, 1.7928645412287794], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 300, 0, 0.0, 313.14666666666665, 248, 418, 272.5, 387.0, 390.95, 402.94000000000005, 2.4273022962279724, 0.41722418766283154, 1.7944021857857178], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 300, 0, 0.0, 316.3233333333334, 253, 1408, 272.0, 384.90000000000003, 390.95, 794.2400000000034, 2.4252615240343416, 0.4168418244434025, 1.788156690083914], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 300, 0, 0.0, 83.97999999999998, 54, 116, 84.5, 113.0, 114.0, 115.0, 2.4303895914515095, 0.510286877111401, 1.7492159461911745], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 300, 0, 0.0, 487.1466666666668, 352, 1483, 472.0, 622.7000000000005, 774.1499999999999, 1188.7700000000011, 2.42107301956227, 13.665822317451093, 2.030958714652334], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
