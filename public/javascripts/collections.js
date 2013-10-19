$(document).ready(function(){
	
	function generateRandomIndex(maxLength){
		return Math.floor(Math.random() * (maxLength - 1)) + 0;
	}
		
	function getAlbumImages(json){
		var images = "<div>";
		
		for (var i = 0; i < 4; i++) {
			images += "<img style='width:83px; height:100px;' src='" +
						(json.items.length > 0 ? json.items[generateRandomIndex(json.items.length)].imgUrl : "") +
						"' alt='...'>";
		}
		
		return images + "</div>";
	}
	
	function listAlbums(){
		jsRoutes.controllers.SellerController.listCollections(1).ajax({success:
			function(json)
			{
				$("#albums").children().remove();
				
				for (var i = 0; i < json.length; i++) {
					$("#albums").append(
							"<div id='" +
							json[i].id +
							"' class='album col-sm-6 col-md-4' style='margin-top: 30px;'>" +
							"<div class='thumbnail'>" +
							getAlbumImages(json[i]) +
							"<div class='caption'>" +
							"<h3 class='title'>" +
							json[i].title +
							"</h3>" +
							"<p class='description'>" +
							json[i].description +
							"</p>" +
							"<br>" +
							"<br>" +
							"<p><a href='#edit' data-toggle='modal' class='btn btn-primary button_edit'>Editar</a>" +
							"<a class='btn btn-default button_delete' href='#delete' data-toggle='modal' style='float: right;'>Eliminar</a></p>" +
							"</div>" +
							"</div>" +
							"</div>"
							);
					
					$("#" + json[i].id).val(json[i].id);
					
					$(".button_delete").click(function(){
						$('#delete').val($(this).parent().parent().parent().parent().val());
					});
					
					$(".button_edit").click(function(){
						$('#edit').val($(this).parent().parent().parent().parent().val());
						$("#iframe_edit").contents().find("#title").val($(this).parent().parent().find('.title').text());
						$("#iframe_edit").contents().find("#description").text($(this).parent().parent().find('.description').text());
					});
				}
			}
		});
	}
	
	listAlbums();
	
	$('#confirmDelete').click(function(){
		$("#albums").children().each(function() {
			if($(this).val() == $("#delete").val()){
				$(this).remove();
			}
		});
		//listAlbums();
	});
	
	$('#confirmCreate').click(function(){
		$("#create_collection").contents().find("#button_create").click();
		listAlbums();
	});
});