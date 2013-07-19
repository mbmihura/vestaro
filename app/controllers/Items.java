package controllers;

import models.Item;
import models.Seller;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.items.*;;

public class Items extends Controller {
    
    public static Result create() {
    	//TODO
    	return null;
    }
    
    public static Result read(String itemId) {
        return ok(item.render(
        	Item.find.ref(itemId)
        ));
    }
    
    public static Result update(String itemId) {
    	//TODO
    	return null;
    }
    
    public static Result delete(String itemId) {
    	//TODO
    	return null;
    }
}
