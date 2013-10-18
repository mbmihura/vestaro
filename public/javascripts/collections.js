$(document).ready(function(){
	
	function generateRandomIndex(maxLength){
		return Math.floor(Math.random() * (maxLength - 1)) + 0;
	}
		
	function getAlbumImages(json){
		var images = "<div>";
		
		for (var i = 0; i < 3; i++) {
			images += "<img style='width:80px; height:100px;' src='" +
						json.items[generateRandomIndex(json.items.length)].imgUrl +
						"' alt='...'>";
		}
		
		return images + "</div>";
	}
		
	$('#confirmDelete').click(function(){
		$("#albums").children().filter(function() {
		    return $(this).val() == $(this).attr('value');
		}).each(function() {
		    $(this).remove();
		});
	});
	
	jsRoutes.controllers.SellerController.listCollections(1).ajax({success:
		function(json)
		{
			for (var i = 0; i < json.length; i++) {
				$("#albums").append(
						"<div value='" +
						json[i].id +
						"' class='album col-sm-6 col-md-3'>" +
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
						"<p><a href='#edit' data-toggle='modal' class='btn btn-primary'>Editar</a>" +
						"<a class='btn btn-default' href='#delete' data-toggle='modal' style='float: right;'>Eliminar</a></p>" +
						"</div>" +
						"</div>" +
						"</div>"
						);
			}
		}
	});

});