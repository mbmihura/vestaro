$(document).ready(function(){
	
	$('.search-btn').click(function(){
		jsRoutes.controllers.Items.read($('.search-input').val()).ajax({
			success: function(data){
				console.log(data);
				$('#items').append(data);
			},
			error: function(xhr, status, error) {
			  alert(status);
			}
		});
	});
	
	$('.items-btn').click(function(){
		jsRoutes.controllers.Items.form().ajax({
			success: function(data){
				$('#main').empty().append(data);
			},
			error: function(xhr, status, error) {
			  alert(status);
			}
		});
	});
});