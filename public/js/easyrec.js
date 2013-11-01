/* Si es servicio de Koding... */ var easyrecApiUrl="http://vestaro.kd.io:8080/easyrec-web/api/1.0/json/";
/* Si es instancia local...    */ //var easyrecApiUrl="http://localhost:8080/easyrec-web/api/1.0/json/";

var tenantId = "Vestaro";
var apiKey = "2df1c6d670c4ca40b6ee160e3d74e8b6";

$(document).ready(function(){

	$('.btn-view-item').click(function(){
		easyrec_view({
			itemId: $('#itemId').val(),
			userId: $('#userId').val(),
			itemUrl: "http://url.ejemplo.com.ar",
			itemDescription: $('#itemDescription').val(),
			itemImageUrl: "http://url.ejemplo/ejemplo.png"
		});
	});
	
	$('.btn-buy-item').click(function(){
		easyrec_buy({
			itemId: $('#itemId').val(),
			userId: $('#userId').val(),
			itemUrl: "http://url.ejemplo.com.ar",
			itemDescription: $('#itemDescription').val(),
			itemImageUrl: "http://url.ejemplo/ejemplo.png"
		});
	});
	
	$('.btn-like-item').click(function(){
		easyrec_sendAction('like', {
			itemId: $('#itemId').val(),
			userId: $('#userId').val(),
			itemUrl: "http://url.ejemplo.com.ar",
			itemDescription: $('#itemDescription').val(),
			itemImageUrl: "http://url.ejemplo/ejemplo.png"
		});
	});
	
	$('.btn-share-item').click(function(){
		easyrec_sendAction('share', {
			itemId: $('#itemId').val(),
			userId: $('#userId').val(),
			itemUrl: "http://url.ejemplo.com.ar",
			itemDescription: $('#itemDescription').val(),
			itemImageUrl: "http://url.ejemplo/ejemplo.png"
		});
	});
	
	$('.btn-rate-item').click(function(){
		easyrec_rate({
			itemId: $('#itemId').val(),
			userId: $('#userId').val(),
			ratingValue: Math.floor(Math.random() * 10),
			itemUrl: "http://url.ejemplo.com.ar",
			itemDescription: $('#itemDescription').val(),
			itemImageUrl: "http://url.ejemplo/ejemplo.png"
		});
	});
	
	$('.btn-ranking-items').click(function(){
		easyrec_mostViewedItems({
			numberOfResults:10,
			timeRange:'ALL',
			drawingCallback:'drawingCallback'
		});
	});
	
	$('.btn-related-items').click(function(){
		 easyrec_relatedItems({
		   userId: 100,
	       itemId: 200,
	       drawingCallback:'drawingCallback',
	       numberOfResults:10
	     });
	});
	
});

function generateRandomColor(){
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function drawingCallback(json)
{
	if("undefined" == typeof(json.error))
	{
		try{
			var items = json.recommendeditems.item;
		} catch(e) {
			console.log(e.message);
			$("#resultados").text("No se han encontrado resultados.");
			return;
		}
		
		if("undefined" == typeof(items.length))
		{
			items = new Array(items);
		}
		
		if(items.length > 0)
		{	
			var elements = "Resultados: ";
			
			for(x = 0; x < items.length; x++)
			{
				elements += items[x].description + ", ";
			}
			
			elements += "Total: " + items.length;
			
			console.log(items.length);
			
			$("#resultados").text(elements);
		}
	}
}

function drawChartMonthlyBoughtItems(json)
{
	try{
		var items = json.recommendeditems.item;
	} catch(e) {
		console.log(e.message);
		return;
	}
	
	if("undefined" == typeof(json.error))
	{
		var chart = new AmCharts.AmSerialChart();
	    chart.dataProvider = items;
	    chart.categoryField = "description";                
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
	    graph.valueField = "value";
	    graph.type = "column";
	    graph.balloonText = "Unidades vendidas: [[value]]";
	    graph.lineAlpha = 0;
	    graph.fillColors = generateRandomColor();
	    graph.fillAlphas = 1;
	    chart.addGraph(graph);
	    chart.write("chartdiv_mostMonthlyBoughtItems");
	}
}

function drawChartAllTimeBoughtItems(json)
{
	try{
		var items = json.recommendeditems.item;
	} catch(e) {
		console.log(e.message);
		return;
	}
	
	if("undefined" == typeof(json.error))
	{
		var chart = new AmCharts.AmSerialChart();
	    chart.dataProvider = items;
	    chart.categoryField = "description";                
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
	    graph.valueField = "value";
	    graph.type = "column";
	    graph.balloonText = "Unidades vendidas: [[value]]";
	    graph.lineAlpha = 0;
	    graph.fillColors = generateRandomColor();
	    graph.fillAlphas = 1;
	    chart.addGraph(graph);
	    chart.write("chartdiv_mostAllTimeBoughtItems");
	}
}

function drawChartMonthlyViewedItems(json)
{
	try{
		var items = json.recommendeditems.item;
	} catch(e) {
		console.log(e.message);
		return;
	}
	
	if("undefined" == typeof(json.error))
	{
		var chart = new AmCharts.AmSerialChart();
	    chart.dataProvider = items;
	    chart.categoryField = "description";                
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
	    graph.valueField = "value";
	    graph.type = "column";
	    graph.balloonText = "Cantidad de vistas: [[value]]";
	    graph.lineAlpha = 0;
	    graph.fillColors = generateRandomColor();
	    graph.fillAlphas = 1;
	    chart.addGraph(graph);
	    chart.write("chartdiv_mostMonthlyViewedtItems");
	}
}

function drawChartAllTimeViewedItems(json)
{
	try{
		var items = json.recommendeditems.item;
	} catch(e) {
		console.log(e.message);
		return;
	}
	
	if("undefined" == typeof(json.error))
	{
		var chart = new AmCharts.AmSerialChart();
	    chart.dataProvider = items;
	    chart.categoryField = "description";                
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
	    graph.valueField = "value";
	    graph.type = "column";
	    graph.balloonText = "Cantidad de vistas: [[value]]";
	    graph.lineAlpha = 0;
	    graph.fillColors = generateRandomColor();
	    graph.fillAlphas = 1;
	    chart.addGraph(graph);
	    chart.write("chartdiv_mostAllTimeViewedItems");
	}
}
