package controllers;

import models.Item;
import models.Seller;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.seller.sellerItem;

public class Items extends Controller {
  
    public static Result index(Long sellerId) {
        return ok(sellerItem.render(
        	Seller.find.ref(sellerId),
        	Item.findItemsOwnedBy(sellerId)
        ));
    }
  
}
