function drawingCallbackExample(json)
{
	drawingCallbackExampleToDiv(json, "resultados");
}

function drawingCallbackExampleToDiv(json, div)
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
			
			document.getElementById(div).innerHTML += listString + "</ul>";
		}
	}
}