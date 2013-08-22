package controllers;

import models.Item;
import models.Seller;
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
    
    public static Result listCollections(Long sellerId) {
    	return ok();
    }
}
