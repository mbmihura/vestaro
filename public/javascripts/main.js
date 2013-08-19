$(document).ready(function(){
	
	$('.search-btn').click(function(){
		jsRoutes.controllers.Items.read($('.search-input').val()).ajax({
			success: function(data){
				console.log(data);
				$('#items').append(data);
			}
		});
	});
});