$(document).ready(function(){

	$('#btn_item').click(function(){
		$(this).parent().addClass("active");
		$('#btn_album').parent().removeClass("active");
		$('#btn_all').parent().removeClass("active");
		$('#album').fadeOut(function(){$('#prenda').show();});
	});
	
	$('#btn_album').click(function(){
		$('#btn_item').parent().removeClass("active");
		$(this).parent().addClass("active");
		$('#btn_all').parent().removeClass("active");
		$('#prenda').fadeOut(function(){$('#album').show();});
	});
	
	$('#btn_all').click(function(){
		$('#btn_item').parent().removeClass("active");
		$('#btn_album').parent().removeClass("active");
		$(this).parent().addClass("active");
		$('#prenda').fadeIn();
		$('#album').fadeIn();
	});
	
});

AmCharts.ready(function () {
		
	// Monthly boughts	
	easyrec_mostBoughtItems({
		numberOfResults:5,
		timeRange:'MONTH',
		drawingCallback:'drawChartMonthlyBoughtItems'
	});
	
	// All time boughts
	easyrec_mostBoughtItems({
		numberOfResults:5,
		timeRange:'ALL',
		drawingCallback:'drawChartAllTimeBoughtItems'
	});
	
	// Monthly views	
	easyrec_mostViewedItems({
		numberOfResults:5,
		timeRange:'MONTH',
		drawingCallback:'drawChartMonthlyViewedItems'
	});
	
	// All time views
	easyrec_mostViewedItems({
		numberOfResults:5,
		timeRange:'ALL',
		drawingCallback:'drawChartAllTimeViewedItems'
	});
	
	// Biggest collections
	jsRoutes.controllers.Dashboard.biggestCollections(1).ajax({success: 
		function(json)
		{
	        chart = new AmCharts.AmSerialChart();
	        chart.dataProvider = json;
	        chart.categoryField = "title";
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
	        valueAxis.title = "Albums";
	        valueAxis.dashLength = 5;
	        chart.addValueAxis(valueAxis);
	        var graph = new AmCharts.AmGraph();
	        graph.valueField = "items";
	        graph.colorField = "color";
	        graph.balloonText = "Cantidad de prendas: [[items]]";
	        graph.type = "column";
	        graph.lineAlpha = 0;
	        graph.fillAlphas = 1;
	        chart.addGraph(graph);
	        chart.write("chartdiv_biggestAlbums");
		}
	});
	
	// All items from albums
	jsRoutes.controllers.Dashboard.allItemsFromAlbums(1).ajax({success:
		function(json)
		{
			var selected;
			
			function generateChartData(){
				var chartData = [];
				
				for (var i = 0; i < json.length; i++) {
			        if (json[i].id == selected) {
			            for (var x = 0; x < json[i].items.length; x++) {
			                chartData.push({
			                    title: json[i].items[x].title,
				                views: json[i].items[x].views,
			                    description: json[i].items[x].description,
			                    pulled: true
			                });
			            }
			        }
			        else {
			        	var views = 0;
			        	for (var x = 0; x < json[i].items.length; x++) {
			                views = views + json[i].items[x].views; 
			            }
			        	
			            chartData.push({
			                title: json[i].title,
			                views: views,
			                description: json[i].description,
			                id: json[i].id
			            });
			        }
				}
		        
		        return chartData;
			}
				
			var chart = new AmCharts.AmPieChart();
		    chart.dataProvider = generateChartData();
		    chart.titleField = "title";
		    chart.valueField = "views";
		    chart.outlineColor = "#FFFFFF";
		    chart.outlineAlpha = 0.8;
		    chart.outlineThickness = 2;
		    chart.pulledField = "pulled";
		    chart.balloonText = "Cantidad de vistas: [[views]]";
		    chart.addListener("clickSlice", function (event) {
		        if (event.dataItem.dataContext.id != undefined) {
		        	selected = event.dataItem.dataContext.id;
		        }
		        else {
		            selected = undefined;
		        }
		        chart.dataProvider = generateChartData();
		        chart.validateData();
		    });
		    
	        chart.write("chartdiv_mostViewedAlbums");
		}
	});
});


