$(document).ready(function(){
	jsRoutes.controllers.SellerController.findCurrentSeller().ajax({success:
		function(json)
		{
			$('#name').val(json.name);
			$('#logoUrl').attr('src', json.logoUrl);
			$('#webpageUrl').val(json.webpageUrl);
			$('#mp_client_secret').val(json.mp_client_secret);
			$('#mp_client_id').val(json.mp_client_id);
			
			if(json.pointsEnabled){
				$('#pointsEnabled').prop('checked', true);
				$("#pointMoneyRelation").prop('disabled', false);
		    	$('#points_ok').show();
		    	$('#points_warning').hide();
		    	$("#pointMoneyRelation").prop('disabled', false);
			}

	    	$("#pointMoneyRelation").val(json.pointMoneyRelation);
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
		jsRoutes.controllers.SellerController.update($('#logoUrl').attr('src'), $('#name').val(), $('#webpageUrl').val(),
													$('#pointsEnabled').is(':checked'),
													$('#pointsEnabled').is(':checked') ? $('#pointMoneyRelation').val() : 0,
													$('#mp_client_secret').val(), $('#mp_client_id').val()).ajax({
			success:
			function(json)
			{
				$("#okResult").show();
			}
		});
	});
});