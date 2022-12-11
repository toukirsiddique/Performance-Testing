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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.83046875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.465, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.95, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.9975, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.7925, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.465, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.5, 500, 1500, "Find Flights"], "isController": true}, {"data": [1.0, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "Purchase"], "isController": true}, {"data": [0.92, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.93, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.5, 500, 1500, "Choose Flight"], "isController": true}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.855, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5600, 0, 0.0, 420.6648214285716, 59, 1991, 368.0, 745.0, 931.9499999999998, 1345.9599999999991, 0.6394160487262432, 17.45359698502773, 0.768271584773266], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 200, 0, 0.0, 1285.575, 976, 1991, 1245.0, 1478.4, 1551.7999999999997, 1842.7800000000002, 0.0232400674566198, 6.519860667516324, 0.08338282015197378], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 200, 0, 0.0, 831.0499999999998, 620, 1242, 871.0, 974.1, 1058.3999999999999, 1238.4300000000005, 0.023119393402603657, 2.046325957755551, 0.10076352808185561], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 200, 0, 0.0, 415.6599999999999, 340, 755, 390.5, 503.40000000000003, 553.9, 730.8200000000002, 0.02315101522989537, 0.14813032401003365, 0.01589371455724262], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 200, 0, 0.0, 318.4399999999999, 256, 401, 275.0, 386.0, 391.95, 401.0, 0.02312137659127094, 0.0039514071322972796, 0.01709265828085166], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 200, 0, 0.0, 315.60999999999984, 253, 414, 272.0, 389.0, 393.0, 405.96000000000004, 0.023121678643118163, 0.003996618281085855, 0.017092881575039503], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 200, 0, 0.0, 267.4399999999998, 252, 304, 267.0, 274.0, 278.0, 295.99, 0.02315170129119353, 0.003979198659423888, 0.017115076052181155], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 200, 0, 0.0, 266.93000000000006, 253, 296, 266.0, 273.0, 274.95, 289.95000000000005, 0.0231517066512075, 0.004001808669202859, 0.017115080014613357], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 200, 0, 0.0, 63.605000000000025, 59, 72, 64.0, 65.0, 66.0, 70.96000000000004, 0.023152248025402646, 0.00484976289203991, 0.01666328788547046], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 200, 0, 0.0, 803.5949999999998, 620, 1196, 853.5, 926.7, 969.8499999999999, 1144.5900000000004, 0.02296672167962066, 0.13310381492175466, 0.10366424570625654], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 200, 0, 0.0, 266.915, 253, 285, 267.0, 272.0, 275.0, 284.0, 0.0231517066512075, 0.003979199580676289, 0.017069861837560218], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 200, 0, 0.0, 267.0749999999999, 255, 296, 267.0, 273.0, 276.95, 285.99, 0.023151695931182045, 0.003956588660114119, 0.017115072089750792], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 200, 0, 0.0, 319.69499999999994, 253, 544, 273.0, 389.0, 391.95, 434.63000000000034, 0.02312141668619463, 0.003973993492939702, 0.01709268792133724], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 200, 0, 0.0, 319.2800000000003, 255, 412, 275.5, 388.0, 390.0, 404.97, 0.02312133382350561, 0.0039739792509150265, 0.017047467809322984], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 200, 0, 0.0, 217.54499999999996, 106, 303, 279.0, 294.0, 295.0, 299.97, 0.02312158775943144, 1.8962750218932536, 0.01551223710032168], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 200, 0, 0.0, 487.4750000000001, 352, 851, 488.0, 591.5, 677.3499999999999, 827.6500000000003, 0.023120430391435826, 0.13434234455961244, 0.01693390897810241], "isController": false}, {"data": ["Test", 200, 0, 0.0, 1285.575, 976, 1991, 1245.0, 1478.4, 1551.7999999999997, 1842.7800000000002, 0.023239824413830625, 6.519792483328622, 0.08338194814102902], "isController": true}, {"data": ["https://blazedemo.com/reserve.php", 200, 0, 0.0, 688.2900000000003, 612, 1031, 663.0, 773.7, 837.0, 1009.7500000000002, 0.023150289013995625, 0.1688908535928265, 0.10096600657861764], "isController": false}, {"data": ["Find Flights", 200, 0, 0.0, 688.2900000000003, 612, 1031, 663.0, 773.7, 837.0, 1009.7500000000002, 0.02324361105768309, 0.16957167617814603, 0.10137301463243426], "isController": true}, {"data": ["https://blazedemo.com/-5", 200, 0, 0.0, 371.59, 262, 463, 384.0, 403.9, 410.95, 441.8800000000001, 0.02324453494833263, 0.09232030129449977, 0.013960340813695864], "isController": false}, {"data": ["https://blazedemo.com/-4", 200, 0, 0.0, 725.9549999999994, 502, 1118, 714.5, 883.4000000000001, 962.0, 1015.6800000000003, 0.023242957354867776, 2.877382788090355, 0.013913996932162059], "isController": false}, {"data": ["Purchase", 200, 0, 0.0, 803.5949999999997, 620, 1196, 853.5, 926.7, 969.8499999999999, 1144.5900000000004, 0.023120366245097616, 0.13399426320132451, 0.10435774686019647], "isController": true}, {"data": ["https://blazedemo.com/-3", 200, 0, 0.0, 457.86, 326, 704, 457.0, 550.5, 637.5999999999999, 670.8700000000001, 0.023244629502688127, 0.8963710251974107, 0.013937697768213386], "isController": false}, {"data": ["https://blazedemo.com/-2", 200, 0, 0.0, 438.39500000000004, 314, 629, 444.5, 537.8, 591.0, 612.94, 0.023244102709646407, 0.6578489654572875, 0.013891983260062109], "isController": false}, {"data": ["https://blazedemo.com/-1", 200, 0, 0.0, 287.85500000000025, 272, 333, 290.0, 295.0, 298.0, 302.97, 0.023244799702466564, 1.9063800255983354, 0.01432369981665664], "isController": false}, {"data": ["https://blazedemo.com/-0", 200, 0, 0.0, 556.555, 451, 1197, 517.5, 674.6, 767.5999999999999, 1147.5900000000004, 0.02324266563159329, 0.0906214282559924, 0.013369072321297313], "isController": false}, {"data": ["Choose Flight", 200, 0, 0.0, 831.0499999999998, 620, 1242, 871.0, 974.1, 1058.3999999999999, 1238.4300000000005, 0.023150144312212108, 2.049047758603028, 0.10089755279824476], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-5", 200, 0, 0.0, 310.79999999999995, 253, 399, 271.0, 385.0, 389.95, 396.99, 0.022968391244495193, 0.003925710776964403, 0.016979562668049668], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 200, 0, 0.0, 311.52000000000015, 251, 407, 271.5, 384.0, 388.0, 402.98, 0.02296803515579333, 0.003970957953107081, 0.016979299426694874], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 200, 0, 0.0, 310.63999999999993, 255, 424, 271.0, 386.0, 390.0, 416.8700000000001, 0.02296807999598518, 0.003947638749309953, 0.016979332575157016], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 200, 0, 0.0, 309.27, 251, 413, 271.0, 386.0, 390.0, 410.95000000000005, 0.02296807999598518, 0.003948535939934796, 0.016934473043914856], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 200, 0, 0.0, 93.885, 59, 151, 117.5, 126.0, 126.0, 128.0, 0.02296874734423859, 0.004833754934261148, 0.016531217570999842], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 200, 0, 0.0, 470.11000000000007, 354, 795, 477.5, 557.9, 606.9, 755.6100000000004, 0.022967763480727807, 0.11248372446860347, 0.019266903154243346], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
