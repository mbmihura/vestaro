$(document).ready(function(){

	var date = new Date();
	
	Number.prototype.padLeft =
		function(base, chr){
		   var len = (String(base || 10).length - String(this).length) + 1;
		   return len > 0 ? new Array(len).join(chr || '0') + this : this;
		}
	
	function formatFilter(date){
	    return date.getDate().padLeft() + "/" + (date.getMonth() + 1).padLeft() + "/" + date.getFullYear();
	}
	
	function formatDate(date){
	    return date.substring(6, 10) + date.substring(3, 5) + date.substring(0, 2);
	}
	
	$('.date').datepicker();
	$('#buy_filter_start').val(formatFilter(new Date(date.getFullYear(), date.getMonth(), 1)));
	$('#view_filter_start').val(formatFilter(new Date(date.getFullYear(), date.getMonth(), 1)));
	$('#view_album_filter_start').val(formatFilter(new Date(date.getFullYear(), date.getMonth(), 1)));
	$('#buy_filter_end').val(formatFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0)));
	$('#view_filter_end').val(formatFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0)));
	$('#view_album_filter_end').val(formatFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0)));
	
	$('#view_album_filter').click(function(){
		// All items from albums
		jsRoutes.controllers.Dashboard.itemsViewedFromCollections(1, formatDate($('#view_album_filter_start').val()), formatDate($('#view_album_filter_end').val())).ajax({success:
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
	
	$('#buy_filter').click(function(){
		// Most purchases	
		jsRoutes.controllers.Actions.actionsFrom(1, 1, formatDate($('#buy_filter_start').val()), formatDate($('#buy_filter_end').val()), "BUY").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "purchases";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[purchases]] unidades vendidas";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_mostMonthlyBoughtItems");
			}
		});
		
		// Less purchases	
		jsRoutes.controllers.Actions.actionsFrom(0, 1, formatDate($('#buy_filter_start').val()), formatDate($('#buy_filter_end').val()), "BUY").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "purchases";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[purchases]] unidades vendidas";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_lessBoughtItems");
			}
		});
	});
	
	$('#view_filter').click(function(){
		// Most views	
		jsRoutes.controllers.Actions.actionsFrom(1, 1, formatDate($('#view_filter_start').val()), formatDate($('#view_filter_end').val()), "VIEW").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "views";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[views]] veces visto";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_mostMonthlyViewedtItems");
			}
		});
		
		// Less views	
		jsRoutes.controllers.Actions.actionsFrom(0, 1, formatDate($('#view_filter_start').val()), formatDate($('#view_filter_end').val()), "VIEW").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "views";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[views]] veces visto";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_lessViewedItems");
			}
		});
	});
	
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
		
	AmCharts.ready(function () {
		// Most purchases	
		jsRoutes.controllers.Actions.actionsFrom(1, 1, formatDate($('#buy_filter_start').val()), formatDate($('#buy_filter_end').val()), "BUY").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "purchases";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[purchases]] unidades vendidas";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_mostMonthlyBoughtItems");
			}
		});
		
		// Most views	
		jsRoutes.controllers.Actions.actionsFrom(1, 1, formatDate($('#view_filter_start').val()), formatDate($('#view_filter_end').val()), "VIEW").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "views";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[views]] veces visto";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_mostMonthlyViewedtItems");
			}
		});
		
		// Less purchases	
		jsRoutes.controllers.Actions.actionsFrom(0, 1, formatDate($('#buy_filter_start').val()), formatDate($('#buy_filter_end').val()), "BUY").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "purchases";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[purchases]] unidades vendidas";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_lessBoughtItems");
			}
		});
		
		// Less views	
		jsRoutes.controllers.Actions.actionsFrom(0, 1, formatDate($('#view_filter_start').val()), formatDate($('#view_filter_end').val()), "VIEW").ajax({success: 
			function(json)
			{
				var chart = new AmCharts.AmSerialChart();
			    chart.dataProvider = json;
			    chart.categoryField = "id";                
			    chart.rotate = true;
			    chart.depth3D = 20;
			    chart.angle = 30;
			    var categoryAxis = chart.categoryAxis;
			    categoryAxis.gridPosition = "start";
			    categoryAxis.axisColor = "#DADADA";
			    categoryAxis.fillAlpha = 1;
			    categoryAxis.gridAlpha = 0;
			    categoryAxis.fillColor = "#FAFAFA";
			    var valueAxis = new AmCharts.ValueAxis();
			    valueAxis.axisColor = "#DADADA";
			    valueAxis.gridAlpha = 0.1;
			    chart.addValueAxis(valueAxis);
			    var graph = new AmCharts.AmGraph();
			    graph.valueField = "views";
			    graph.type = "column";
			    graph.balloonText = "[[description]]: [[views]] veces visto";
			    graph.lineAlpha = 0;
			    graph.fillColors = generateRandomColor();
			    graph.fillAlphas = 1;
			    chart.addGraph(graph);
			    chart.write("chartdiv_lessViewedItems");
			}
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
		        valueAxis.dashLength = 5;
		        chart.addValueAxis(valueAxis);
		        var graph = new AmCharts.AmGraph();
		        graph.valueField = "item_count";
		        graph.colorField = generateRandomColor();
		        graph.balloonText = "Cantidad de prendas: [[item_count]]";
		        graph.type = "column";
		        graph.lineAlpha = 0;
		        graph.fillAlphas = 1;
			    graph.fillColors = generateRandomColor();
		        chart.addGraph(graph);
		        chart.write("chartdiv_biggestAlbums");
			}
		});
		
		// All items from albums
		jsRoutes.controllers.Dashboard.itemsViewedFromCollections(1, formatDate($('#view_album_filter_start').val()), formatDate($('#view_album_filter_end').val())).ajax({success:
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
});