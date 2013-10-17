$(document).ready(function(){
	
	function generateRandomColor(maxLength){
		return Math.floor(Math.random() * (maxLength - 1)) + 0;
	}
		
	function getAlbumImages(json){
		var images = "<div>";
		
		for (var i = 0; i < 3; i++) {
			images += "<img style='width:80px; height:100px;' src='" +
						json.items[generateRandomColor(json.items.length)].imgUrl +
						"' alt='...'>";
		}
		
		return images + "</div>";
	}
	
	$('#delete').modal().css(
    {
        'margin-top': function () {
            return window.pageYOffset-($(this).height() / 2 );
        }
    });
	
	jsRoutes.controllers.SellerController.listCollections(1).ajax({success:
		function(json)
		{
			for (var i = 0; i < json.length; i++) {
				$("#albums").append(
						"<div class='col-sm-6 col-md-3'>" +
						"<div class='thumbnail'>" +
						getAlbumImages(json[i]) +
						"<div class='caption'>" +
						"<h3>" +
						json[i].title +
						"</h3>" +
						"<p>" +
						json[i].description +
						"</p>" +
						"<br>" +
						"<br>" +
						"<p><a href='#' class='btn btn-primary'>Editar</a>" +
						"<a class='btn btn-default delete' href='#delete' data-toggle='modal' style='float: right;'>Eliminar</a></p>" +
						"</div>" +
						"</div>" +
						"</div>"
						);
				
			}
		}
	});
});