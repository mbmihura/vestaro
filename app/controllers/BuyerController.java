package controllers;

import org.codehaus.jettison.json.JSONException;

import models.BuyOrder;
import models.Buyer;
import models.PaymentManager;
import play.data.Form;
import play.mvc.Result;

public class BuyerController extends BaseController {
  
    public static Result profile(){
    	
    	
    	Buyer buyer = Buyer.findBuyerByUser(currentUserId());
    	return ok(views.html.buyerProfile.render(BuyOrder.findBuyerOrders(buyer.id), buyer));
    }
    
    public static Result openDispute(Long orderId, String disputeMessage){
    	
    	BuyOrder.find.byId(orderId).openDispute(disputeMessage);
    	return ok();
    }
    
    public static Result confirmReception(Long orderId){
    	BuyOrder.find.byId(orderId).confirmReception();
    	return ok();
    }
    
    public static Result payOrder(){
    	String orderId = Form.form().bindFromRequest().get("id");
    	PaymentManager manager = new PaymentManager();
    	BuyOrder buyOrder = BuyOrder.find.byId(Long.parseLong(orderId));
    	
    	try{
    		return ok(views.html.payOrder.render(buyOrder.item,buyOrder.size.size,buyOrder.pointsUsed,manager.checkout(buyOrder) ));
    	} catch (JSONException e) {
			return badRequest();//TODO: think what to do when it fails
		} catch (Exception e) {
			return badRequest();//TODO: think what to do when it fails
		}
    }
	

	
    
}

