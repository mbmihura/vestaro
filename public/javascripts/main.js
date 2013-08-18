$(document).ready(function(){
	
	$('#getItem').click(function(){
		jsRoutes.controllers.Items.read($('#itemId').val()).ajax({
			success: function(data){
				console.log(data);
			}
		});
	});
});