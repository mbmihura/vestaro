package controllers;

import java.util.List;

import models.Item;
import models.Seller;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.sellers.*;

public class Sellers extends Controller {
  
    public static Result listItems(Long sellerId) {
        return ok(sellerItems.render(
        	Seller.find.ref(sellerId),
        	Item.findItemsOwnedBy(sellerId)
        ));
    }
    
	public static Result itemsOwnedBy(Long sellerId){
		List<Item> items = Item.findItemsOwnedBy(sellerId);
		return ok(Json.toJson(items));
	}
    
    public static Result listCollections(Long sellerId) {
    	return TODO;
    }
}
