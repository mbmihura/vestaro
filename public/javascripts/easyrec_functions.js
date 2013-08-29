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