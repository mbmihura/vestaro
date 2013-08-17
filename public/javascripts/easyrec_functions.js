function drawingCallbackExample(json)
{
	if("undefined" == typeof(json.error))
	{
		try{
			var items = json.recommendeditems.item;
		} catch(e) {
			console.log("Error");
			return;
		}
		
		if("undefined" == typeof(items.length))
		{
			items = new Array(items);
		}
		
		if(items.length > 0)
		{
			listString = "<ul>";
			
			for(x = 0; x < items.length; x++)
			{
				listString += "<li><a href='" + items[x].url + "'>" + items[x].description + "</a>" + "</li>";
			}
			
			console.log(items.length);
			
			document.getElementById("resultados").innerHTML += listString + "</ul>";
		}
	}
}

function sendActionExample(actionType)
{		
	for(x = 0; x < $("#count").text; x++)
	{		
		if(actionType != "rate")
		{
			easyrec_sendAction(actionType,
					   {
					 	userId: $("#userId").text,
				        itemId: $("#itemId").text,
				        itemUrl: "http://url.ejemplo.com.ar",
				        itemDescription: $("#itemDescription").text,
				        itemImageUrl: "http://url.ejemplo/ejemplo.png"
				       })
		}
		else
		{
			easyrec_sendAction(actionType,
					   {
					 	userId: $("#userId").text,
					 	ratingValue: Math.floor(Math.random() * 10),
				        itemId: $("#itemId").text,
				        itemUrl: "http://url.ejemplo.com.ar",
				        itemDescription: $("#itemDescription").text,
				        itemImageUrl: "http://url.ejemplo/ejemplo.png"
				       })
		}
		
	}

	document.getElementById("resultados").innerHTML += $("#count") + " \"" + actionType + "\"" + " actions sent.<br>";
}