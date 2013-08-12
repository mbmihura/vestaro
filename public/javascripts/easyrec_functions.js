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

function setItemSamples(json)
{
	setItemSamples(json, "options");
}

function setItemSamples(json, ul)
{
	if(Ebean.find(Item.class).findRowCount() > 0) {
		
		listString = "<ul>";
		
    	for(x = 0; x < Ebean.find(Item.class).findRowCount(); x++)
    	{
    		item = Ebean.find(Item.class).findList().get(x);
    		
			listString += "<li><a tabindex='0' href='#' onClick='$('#selected_item').text('" + item.description + "')>" + item.description + "</a>" + "</li>";
		}
    		
    	document.getElementById(ul).innerHTML += listString + "</ul>";
	}
}