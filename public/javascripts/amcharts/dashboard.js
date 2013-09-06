var chart;

AmCharts.ready(function () {
    jsRoutes.controllers.Dashboard.mostBuyedItems(1).ajax({success: 
    			function(json)
    			{
    				// PIE CHART
    			    chart = new AmCharts.AmPieChart();

    			    // title of the chart
    			    chart.addTitle("Prendas del Vendedor", 16);

    			    chart.sequencedAnimation = false;
    			    chart.startEffect = "elastic";
    			    chart.innerRadius = "30%";
    			    chart.startDuration = 2;
    			    chart.labelRadius = 15;

    			    // the following two lines makes the chart 3D
    			    chart.depth3D = 10;
    			    chart.angle = 15;
    				
    				chart.dataProvider = json;
    			    chart.titleField = "description";
    			    chart.valueField = "price";

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
        graph.balloonText = "[[title]]: [[items]]";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 1;
        chart.addGraph(graph);

        // WRITE
        chart.write("chartdiv2");
		}
	});
});
