package controllers;

import models.Item;
import models.Seller;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.seller.sellerItems;

public class Sellers extends Controller {
  
    public static Result index(Long sellerId) {
        return ok(sellerItems.render(
        	Seller.find.ref(sellerId),
        	Item.findItemsOwnedBy(sellerId)
        ));
    }
  
}
