var chart;

var chartData = [
    {
        "category": "Comisión",
        "excelent": 6,
        "good": 6,
        "average": 6,
        "poor": 6,
        "bad": 6,
        "limit": 78,
        "full": 30,
        "bullet": (new Date()).getDate(),
        "remainingTime": 30 - (new Date()).getDate()
    }
];

AmCharts.ready(function () {
	
	// Monthly boughts	
//	easyrec_mostBoughtItems({
//		numberOfResults:5,
//		timeRange:'MONTH',
//		drawingCallback:'drawMonthlyChart'
//	});
	
	// All time boughts
	easyrec_mostBoughtItems({
		numberOfResults:5,
		timeRange:'ALL',
		drawingCallback:'drawChart'
	});
	
	// Commission
	chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "category";
    chart.rotate = true; // if you want vertical bullet chart, set rotate to false
    chart.columnWidth = 1;
    chart.startDuration = 1;
    categoryAxis = chart.categoryAxis;
    categoryAxis.gridAlpha = 0;
    valueAxis = new AmCharts.ValueAxis();
    valueAxis.maximum = 30;
    valueAxis.minimum = 0;
    valueAxis.axisAlpha = 1;
    valueAxis.gridAlpha = 0;
    chart.addValueAxis(valueAxis);
    graph = new AmCharts.AmGraph();
    graph.valueField = "bullet";
    graph.lineColor = "#000000";
    graph.type = "column";
    graph.balloonText = "[[remainingTime]] días restantes";
    graph.lineAlpha = 1;
    graph.fillAlphas = 1;
    graph.columnWidth = 0.3; // this makes it narrower than color graph
    graph.clustered = false; // this makes the trick - one column above another
    chart.addGraph(graph);	    
    graph = new AmCharts.AmGraph();
    graph.valueField = "full";
    graph.showBalloon = true;
    graph.balloonText = "[[remainingTime]] días restantes";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.8;
    graph.fillColors = ["#19d228", "#f6d32b", "#fb2316"];
    graph.gradientOrientation = "horizontal";
    chart.addGraph(graph);   
	chart.write("chartdiv3");
    
//    jsRoutes.controllers.Dashboard.biggestCollections(1).ajax({success: 
//		function(json)
//		{
//	    	// SERIAL CHART
//	        chart = new AmCharts.AmSerialChart();
//	        chart.dataProvider = json;
//	        chart.categoryField = "title";
//	        chart.marginRight = 0;
//	        chart.marginTop = 0;
//	        chart.autoMarginOffset = 0;
//	        // the following two lines makes chart 3D
//	        chart.depth3D = 20;
//	        chart.angle = 30;
//	
//	        // AXES
//	        // category
//	        var categoryAxis = chart.categoryAxis;
//	        categoryAxis.labelRotation = 90;
//	        categoryAxis.dashLength = 5;
//	        categoryAxis.gridPosition = "start";
//	
//	        // value
//	        var valueAxis = new AmCharts.ValueAxis();
//	        valueAxis.title = "Albums";
//	        valueAxis.dashLength = 5;
//	        chart.addValueAxis(valueAxis);
//	
//	        // GRAPH            
//	        var graph = new AmCharts.AmGraph();
//	        graph.valueField = "items";
//	        graph.colorField = "color";
//	        graph.balloonText = "Cantidad de prendas: [[items]]";
//	        graph.type = "column";
//	        graph.lineAlpha = 0;
//	        graph.fillAlphas = 1;
//	        chart.addGraph(graph);
//	
//	        // WRITE
//	        chart.write("chartdiv2");
//		}
//	});
	
	  jsRoutes.controllers.Dashboard.littleItemsStock(1).ajax({success: 
			function(json)
			{
		    	// SERIAL CHART
		        chart = new AmCharts.AmSerialChart();
		        chart.dataProvider = json;
		        chart.categoryField = "id";
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
		        valueAxis.dashLength = 5;
		        chart.addValueAxis(valueAxis);
		
		        // GRAPH            
		        var graph = new AmCharts.AmGraph();
		        graph.valueField = "stock";
		        graph.balloonText = "Stock disponible del talle [[size]]: [[stock]]";
		        graph.type = "column";
		        graph.lineAlpha = 0;
		        graph.fillAlphas = 1;
		        chart.addGraph(graph);
		
		        // WRITE
		        chart.write("chartdiv2");
			}
		});
	
});


