$(document).ready(function(){
			
	function getAlbumImages(album){
		var images = "<div>";
		
		for (var i = 0, ar = []; i < album.items.length; i++) {
			ar[i] = i;
		}
	
		ar.sort(function () {
			return Math.random() - 0.5;
		});
		
		for (var i = 0; i < 4; i++) {
			images += "<img style='width:84px; height:90px;' src='" +
						(i < album.items.length ? album.items[ar.pop()].imgUrl : "") +
						"' alt='...'>";
		}
		
		return images + "</div>";
	}
	
	function listItems(collectionId){
		jsRoutes.controllers.CollectionController.getItemsFromCollection(collectionId).ajax({success:
			function(json)
			{
				$("#items").children().remove();
				
				if(json.length == 0){
					$("#items").append(
							"<div class='media'>" +
							"<h4 class='media-heading'>" +
							"Este álbum no contiene ninguna prenda." +
							"</h4>" +
							"</div>"
							);
				}
				else{
					for (var i = 0; i < json.length; i++) {
						$("#items").append(
								"<div id='" +
								json[i].id +
								"' class='media'>" +
								"<div class='pull-left' style='width:80px; height:80px;'>" +
								"<img class='img-responsive media-object' src='" +
								json[i].imgUrl +
								"' alt='...'>" +
								"</div>" +
								"<div class='media-body'>" +
								"<h4 class='media-heading'>" +
								json[i].title +
								"<span title='Eliminar' style='float: right;' class='glyphicon glyphicon-remove'></span>" +
								"</h4>" +
								json[i].description +
								"</div>" +
								"</div>"
								);
						
						$("#" + json[i].id).val(json[i].id);
						
						$(".glyphicon-remove").click(function(){
							$(this).parent().parent().parent().hide();
						});
					}
				}
			}
		});
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
						"' class='col-md-4'>" +
						"<div class='thumbnail' style='height:300px'>" +
						getAlbumImages(json[i]) +
						"<div title='Haz click para ver su contenido' href='#collectionItems' data-toggle='modal' class='album caption' style='cursor: pointer;'>" +
						"<h3 class='title'>" +
						json[i].title +
						"</h3>" +
						"<p class='description'>" +
						json[i].description +
						"</p>" +
						"<br>" +
						"</div>" +
						"<p><button class='btn btn-md btn-primary'><div href='#edit' data-toggle='modal' class='button_edit'>Editar</div></button>" +
						"<button class='btn btn-md btn-default btn-primary' style='float: right;'><div class='button_delete' href='#delete' data-toggle='modal'>Eliminar</div></button></p>" +
						"</div>" +
						"</div>"
					);
					
					$("#" + json[i].id).val(json[i].id);
					
					$(".button_delete").click(function(){
						$('#delete').val($(this).parent().parent().parent().parent().val());
					});
					
					$(".button_edit").click(function(){
						$('#edit').val($(this).parent().parent().parent().parent().val());
						$("#edit_title").val($(this).parent().parent().parent().find('.title').text());
						$("#edit_description").text($(this).parent().parent().parent().find('.description').text());
					});
					
					$(".album").click(function(){
						$('#collectionItems').val($(this).parent().parent().val());
						$(this).val($(this).parent().parent().val());
						listItems($(this).parent().parent().val());
					});
				}
				
				$("#albums").append(
					"<div id='newAlbum' style='height:300px' align='center' title='Haz click para crear un nuevo álbum' class='col-md-4 thumbnail'>" +
					"<img href='#create' data-toggle='modal' style='cursor: pointer; margin: 50px 0px auto;' class='img-responsive media-object' src='/assets/img/new_album.png' alt='...'>" +
					"</div>"
				);
			}
		});
	}
	
	function listItemsWithNoCollection(sellerId){
		jsRoutes.controllers.CollectionController.getItemsWithNoCollection(sellerId).ajax({success:
			function(json)
			{
				if(json.length == 0){
					$("#items").append(
							"<div class='media'>" +
							"<h4 class='media-heading'>" +
							"No hay ninguna prenda sin álbum." +
							"</h4>" +
							"</div>"
							);
					
					$("#button_addItems").hide();
				}
				else{
					for (var i = 0; i < json.length; i++) {
						$("#items").append(
								"<div id='" +
								json[i].id +
								"' class='media'>" +
								"<div class='pull-left' style='width:80px; height:80px;'>" +
								"<img class='img-responsive media-object' src='" +
								json[i].imgUrl +
								"' alt='...'>" +
								"</div>" +
								"<div class='media-body'>" +
								"<h4 class='media-heading'>" +
								"<input class='checked' style='float: right;' type='checkbox'>" +
								"<p class'title'>" +
								json[i].title +
								"</p>" +
								"</h4>" +
								"<p class'description'>" +
								json[i].description +
								"</p>" +
								"</div>" +
								"</div>"
								);
						
						$("#" + json[i].id).val(json[i].id);
					}
				}
			}
		});
	}
	
	listAlbums();
	
	$('#confirmDelete').click(function(){
		jsRoutes.controllers.CollectionController.delete($('#delete').val()).ajax();

		location.reload();
	});
		
	$('#confirmCreate').click(function(){		
		$.post('/collection', {title: $("#create_title").val(), description: $("#create_description").val()});
		
		location.reload();
	});
	
	$('#confirmUpdate').click(function(){
		jsRoutes.controllers.CollectionController.update(
														$('#edit').val(),
														$("#edit_title").val(),
														$("#edit_description").val()
												  ).ajax();

		location.reload();
	});
	
	$('#add_items').click(function(){
		$("#items").children().remove();
		$("#add_items").hide();
		$("#button_saveItems").hide();
		$("#button_cancel").hide();
		$("#button_addItems").show();
		$("#button_cancel_items").show();
		
		listItemsWithNoCollection(1);
		
	});
	
	$('#button_cancel_items').click(function(){
		$("#items").children().remove();
		$("#add_items").show();
		$("#button_saveItems").show();
		$("#button_cancel").show();
		$("#button_addItems").hide();
		$("#button_cancel_items").hide();

		listItems($('#collectionItems').val());
	});
	
	$('#button_addItems').click(function(){
		$("#add_items").show();
		$("#button_saveItems").show();
		$("#button_cancel").show();
		$("#button_addItems").hide();
		$("#button_cancel_items").hide();
		
		$("#items").children().each(function() {
			$('input[type=checkbox]').each(function () {
			    if(this.checked){
			    	jsRoutes.controllers.ItemController.updateItem($('#collectionItems').val(), $(this).parent().parent().parent().val()).ajax();
			    }
			});
		});
		
		$('#items').children().remove();
		listItems($('#collectionItems').val());
	});
	
	$('#button_saveItems').click(function(){
		$('#items').children().each(function () {
			if ($(this).is(':hidden')) {
				jsRoutes.controllers.CollectionController.deleteCollectionId($(this).val()).ajax();
			}
		});

		location.reload();
	});
});