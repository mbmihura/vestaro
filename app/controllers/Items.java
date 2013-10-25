package controllers;

import java.util.ArrayList;
import java.util.List;

import models.BuyOrder;
import models.Buyer;
import models.Item;
import models.PaymentManager;
import models.Stock;

import org.codehaus.jettison.json.JSONException;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.items.form;
import views.html.items.item;

public class Items extends Controller {
    
	static Form<Item> itemForm = Form.form(Item.class);
	
	public static Result form() {
		return ok(form.render(itemForm));
	}
	
    public static Result submit() {
    	Form<Item> itemFilledForm = itemForm.bindFromRequest();
    	if(itemFilledForm.hasErrors()) {
            return badRequest(form.render(itemFilledForm));
        } else {
        	//TODO: load stock
            return ok(
                item.render(Item.submit(itemFilledForm.get()))
            );
        }
    }
    
    public static Result read(String itemId) {
    	Item item = Item.find.byId(itemId);
    	if(item != null) {
    		/*
    		 * TODO It would be better (RESTfull) if the server returned a json,
    		 * giving the client the power to handle the object the way it wants.
    		 */
    		
    		return ok(views.html.items.item.render(item));
    	} else {
    		return badRequest();
    	}
    	
    }
    
    
    public static Result index() {
    	return ok(Item.find.all().toString());
    }
    
    public static Result update(String itemId) {
    	return TODO;
    }
    
    public static Result delete(String itemId) {
    	return TODO;
    }
    public static Result buy(String itemId){
    	Item item = Item.find.byId(itemId);
    	String pointsAvailable = (item.seller.pointsEnabled ? "pointsEnabled": "pointsDisabled");

    	//TODO: Load AvailableStock
//		return ok(views.html.buyItem.render(item, item.getAvailableStock(),pointsAvailable));
    	Buyer buyer = new Buyer();
		return ok(views.html.buyItem.render(item, item.getMockAvailableStock(), pointsAvailable, buyer.points));
    }
    
    public static Result orderItem(String itemId, String size, Integer pointsUsed) throws Exception{
    	Item item = Item.find.byId(itemId);
    	//TODO: how to get buyer
    	BuyOrder buyOrder  = new BuyOrder();
    	buyOrder.create(buyOrder, item, new Buyer(), size, pointsUsed);

    	PaymentManager manager = new PaymentManager();
    	
		try {
			return ok(Json.toJson(manager.checkout(buyOrder)));
		} catch (JSONException e) {
			return badRequest();//TODO: think what to do when it fails
		} catch (Exception e) {
			return badRequest();//TODO: think what to do when it fails
		}
    }
}
