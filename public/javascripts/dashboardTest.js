AmCharts.ready(function () {
		
	// Monthly boughts	
	easyrec_mostBoughtItems({
		numberOfResults:5,
		timeRange:'MONTH',
		drawingCallback:'drawChartMonthlyBoughtItems'
	});
	
	// Commission	
	var chart;
	var date = new Date();
	var remainingTime = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate() - date.getDate();
	var chartData = [{
	    "commission": "",
	        "max": (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate(),
	        "min": 0,
	        "value": date.getDate()
	}];

    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "commission";
    chart.startDuration = 1;
    chart.columnWidth = 0.5;
    chart.rotate = true;
    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridPosition = "start";
    categoryAxis.axisColor = "#000000";
    categoryAxis.dashLength = 3;
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.dashLength = 3;
    valueAxis.axisAlpha = 0.2;
    valueAxis.position = "top";
    valueAxis.minorGridEnabled = true;
    valueAxis.minorGridAlpha = 0.08;
    valueAxis.gridAlpha = 0.15;
    chart.addValueAxis(valueAxis);
    var graph1 = new AmCharts.AmGraph();
    graph1.type = "column";
    graph1.valueField = "max";
    graph1.lineAlpha = 0;
    graph1.balloonText = "Días restantes: " + remainingTime;
    graph1.fillColors = "#000000";
    graph1.fillAlphas = 0.8;
    chart.addGraph(graph1);
    var graph2 = new AmCharts.AmGraph();
    graph2.type = "line";
    graph2.lineColor = "#000000";
    graph2.bulletColor = "#FFFF00";
    graph2.bulletBorderColor = "#FFFF00";
    graph2.bulletBorderThickness = 2;
    graph2.bulletBorderAlpha = 1;
    graph2.valueField = "value";
    graph2.lineThickness = 2;
    graph2.bullet = "round";
    graph2.fillAlphas = 0;
    graph2.balloonText = "Días restantes: " + remainingTime;
    chart.addGraph(graph2);
    chart.write("chartdiv_commission");
	    
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
		        chart = new AmCharts.AmSerialChart();
		        chart.dataProvider = json;
		        chart.categoryField = "id";
		        chart.marginRight = 0;
		        chart.marginTop = 0;
		        chart.autoMarginOffset = 0;
		        chart.depth3D = 20;
		        chart.angle = 30;
		        var categoryAxis = chart.categoryAxis;
		        categoryAxis.labelRotation = 90;
		        categoryAxis.dashLength = 5;
		        categoryAxis.gridPosition = "start";
		        var valueAxis = new AmCharts.ValueAxis();
		        valueAxis.dashLength = 5;
		        chart.addValueAxis(valueAxis);
		        var graph = new AmCharts.AmGraph();
		        graph.valueField = "stock";
		        graph.balloonText = "Stock disponible del talle [[size]]: [[stock]]";
		        graph.type = "column";
		        graph.lineAlpha = 0;
			    graph.fillColors = "#FFD700";
		        graph.lineColor = "#000000";
		        graph.fillAlphas = 1;
		        chart.addGraph(graph);
		        chart.write("chartdiv_stock");
			}
		});
	
});


