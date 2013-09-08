var chart;

AmCharts.ready(function () {
	// SERIAL CHART
	var chartData = [{
	    year: 9,
	    comission: 150,
	    motorcycles: 650,
	    bicycles: 121}]
	
	chart = new AmCharts.AmSerialChart();
    chart.autoMarginOffset = 3;
    chart.marginRight = 0;
    chart.zoomOutButton = {
        backgroundColor: "#000000",
        backgroundAlpha: 0.15
    };
    chart.dataProvider = chartData;
    chart.categoryField = "month";

    chart.addTitle("Comisión", 15);

    // AXES
    // Category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridAlpha = 0.07;
    categoryAxis.axisColor = "#DADADA";
    categoryAxis.showLastLabel = false;
    categoryAxis.startOnAxis = true;

    // Value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.title = "percent"; // this line makes the chart "stacked"
    valueAxis.stackType = "100%";
    valueAxis.gridAlpha = 0.07;
    chart.addValueAxis(valueAxis);

    // GRAPHS
    // first graph
    var graph = new AmCharts.AmGraph();
    graph.type = "line"; // it's simple line graph
    graph.title = "Comisión";
    graph.valueField = "comission";
    graph.balloonText = "[[value]] ([[percents]]%)";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.6; // setting fillAlphas to > 0 value makes it area graph 
    chart.addGraph(graph);

    // second graph
    graph = new AmCharts.AmGraph();
    graph.type = "line";
    graph.title = "Motorcycles";
    graph.valueField = "motorcycles";
    graph.balloonText = "[[value]] ([[percents]]%)";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.6;
    chart.addGraph(graph);

    // third graph
    graph = new AmCharts.AmGraph();
    graph.type = "line";
    graph.title = "Bicycles";
    graph.valueField = "bicycles";
    graph.balloonText = "[[value]] ([[percents]]%)";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.6;
    chart.addGraph(graph);

    // LEGEND
    var legend = new AmCharts.AmLegend();
    legend.align = "center";
    chart.addLegend(legend);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.zoomable = false; // as the chart displayes not too many values, we disabled zooming
    chartCursor.cursorAlpha = 0;
    chart.addChartCursor(chartCursor);

    // WRITE
    chart.write("chartdiv");
    
    jsRoutes.controllers.Dashboard.mostBuyedItems(1).ajax({success: 
    			function(json)
    			{
    				// PIE CHART
    			    chart = new AmCharts.AmPieChart();
    			    chart.sequencedAnimation = false;
    			    chart.startEffect = "elastic";
    			    chart.innerRadius = "30%";
    			    chart.startDuration = 2;
    			    chart.labelRadius = 15;

    			    // the following two lines makes the chart 3D
    			    chart.depth3D = 10;
    			    chart.angle = 15;
    				
    				chart.dataProvider = json;
    			    chart.titleField = "id";
    			    chart.valueField = "price";
    			    chart.balloonText = "[[id]]: [[price]]";

    			    // WRITE                                 
    			    chart.write("chartdiv");
    			}
    		});
    
    jsRoutes.controllers.Dashboard.biggestCollections(1).ajax({success: 
		function(json)
		{
    	// SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = json;
        chart.categoryField = "title";
        chart.marginRight = 0;
        chart.marginTop = 0;
        chart.autoMarginOffset = 0;
        // the following two lines makes chart 3D
        chart.depth3D = 20;
        chart.angle = 30;

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.labelRotation = 90;
        categoryAxis.dashLength = 5;
        categoryAxis.gridPosition = "start";

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.title = "Albums";
        valueAxis.dashLength = 5;
        chart.addValueAxis(valueAxis);

        // GRAPH            
        var graph = new AmCharts.AmGraph();
        graph.valueField = "items";
        graph.colorField = "color";
        graph.balloonText = "Cantidad de prendas: [[items]]";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 1;
        chart.addGraph(graph);

        // WRITE
        chart.write("chartdiv2");
		}
	});
});
