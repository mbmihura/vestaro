package controllers;

import models.BuyOrder;
import models.Seller;
import play.mvc.Controller;
import play.mvc.Result;

public class PaymentController extends BaseController{

	public static Result success(Long orderId){
		BuyOrder buyOrder= BuyOrder.find.byId(orderId);
		buyOrder.successfulPayment();
		return ok(views.html.successfulPayment.render(buyOrder, (buyOrder.pointsEarned >0)));

		
	}
	public static Result error(Long orderId){
		return ok(views.html.failedPayment.render());		
	}
	
	public static Result commissionPaymentSuccess(){
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	BuyOrder buyOrderManager = new BuyOrder();
    	buyOrderManager.markCommissionsAsPayed(seller.id);
    	return ok(views.html.successfulCommissionPayment.render());
    }
    
    public static Result commissionPaymentError(){
    	
    	return ok(views.html.failedCommissionPayment.render());
    }
}

