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

function drawingCallback(json)
{
	if("undefined" == typeof(json.error))
	{
		try{
			var items = json.recommendeditems.item;
		} catch(e) {
			console.log(e.message);
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

function drawMonthlyChart(json)
{
	try{
		var items = json.recommendeditems.item;
	} catch(e) {
		console.log(e.message);
		return;
	}
	
	if("undefined" == typeof(json.error))
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
		
		chart.dataProvider = items;
	    chart.titleField = "id";
	    chart.valueField = "value";
	    chart.balloonText = "[[description]]: [[value]] unidades";

	    // WRITE
	    chart.write("chartdiv");
	}
}

function drawChart(json)
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
	    graph.fillColors = "#ADFF2F";
	    graph.fillAlphas = 1;
	    chart.addGraph(graph);
	    chart.write("chartdiv");
	}
}