package controllers;

import models.Item;
import models.Seller;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.item.*;;

public class Items extends Controller {
  
    public static Result index(String itemId) {
        return ok(item.render(
        	Item.find.ref(itemId)
        ));
    }
  
}
