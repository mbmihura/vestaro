package controllers;

import models.BuyOrder;
import models.Buyer;
import models.PaymentManager;

import org.codehaus.jettison.json.JSONException;

import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.SubjectPresent;

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
	

	@SubjectPresent
	public static Result readCurrent(){
        return ok(Json.toJson(Buyer.findBuyerByUser(currentUserId()))); 
    }
	
	@SubjectPresent
	public static Result createOrUpdateCurrent(){
		// TODO: check if buyer was already created to avoid losing points if method is call twice [low priority]
    	Buyer buyer = Buyer.createFor(currentUserId());
    	buyer.save();
        return ok(Json.toJson(buyer)); 
    }
}

