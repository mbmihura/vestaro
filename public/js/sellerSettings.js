$(document).ready(function(){
	jsRoutes.controllers.SellerController.findSellerById(1).ajax({success:
		function(json)
		{
			$('#name').val(json.name);
			$('#logoUrl').attr('src', json.logoUrl);
			$('#webpageUrl').val(json.webpageUrl);
		}
	});
	
	$('#pointsEnabled').change(function(){
		  if($(this).is(':checked')){
	    	$('#points_ok').show();
	    	$('#points_warning').hide();
	    	$("#pointMoneyRelation").prop('disabled', false);
		  } else {
	    	$('#points_ok').hide();
	    	$('#points_warning').show();
	    	$("#pointMoneyRelation").prop('disabled', true);
		  }
		});
	
	$('#update').click(function(){
		jsRoutes.controllers.SellerController.update(1, $('#logoUrl').attr('src'), $('#name').val(), $('#webpageUrl').val(), $('#pointsEnabled').is(':checked'), $('#pointsEnabled').is(':checked') ? $('#pointMoneyRelation').val() : 0).ajax({
			success:
			function(json)
			{
				$("#okResult").show();
			}
		});
	});
	
});