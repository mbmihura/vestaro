$(document).ready(function(){
	jsRoutes.controllers.SellerController.readCurrent().ajax({success:
		function(json)
		{
			$('#name').val(json.brandName);
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
	
	/* No hace falta mandar todo, los datos que se manden seran los que se modifiquen */
	$('#update').click(function(){
		var sellerData = {
			brandName: $('#name').val(),
			logoUrl: $('#logoUrl').attr('src'),
			webpageUrl: $('#webpageUrl').val(),
			pointsEnabled: $('#pointsEnabled').is(':checked'),
			pointMoneyRelation: $('#pointMoneyRelation').val(),
			mp_client_secret: $('#mp_client_secret').val(),
			mp_client_id:  $('#mp_client_id').val()
		}
		$.ajax({url: '/seller', type:'PUT', data: sellerData}).done( function(d){console.log(d)})
		
	});
});