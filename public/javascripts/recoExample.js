$(document).ready(function(){

$('.btn-view-item').click(function(){
	easyrec_view({
		itemId: $('#itemId').val(),
		userId: $('#userId').val(),
		itemDescription: $('#itemDescription').val(),
		actionCallback: 'actionCallback'
	});
});

});

function actionCallback(json){
	console.log(json);
}