package controllers;

import models.BuyOrder;
import models.Buyer;
import play.mvc.Result;

public class BuyerController extends BaseController {
  
    public static Result profile(){
    	
    	
    	Buyer buyer = Buyer.findBuyerByUser(currentUserId());
    	return ok(views.html.buyerProfile.render(BuyOrder.findBuyerOrders(buyer.id), buyer));
    }
    
    public static Result openDispute(Long orderId){
    	
    	BuyOrder.find.byId(orderId).openDispute();
    	return ok();
    }
	

	
    
}

