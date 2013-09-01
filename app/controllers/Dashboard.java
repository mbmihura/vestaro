package controllers;

import java.util.List;

import models.Item;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboard.*;

public class Dashboard extends Controller {
  
    public static Result dashboardTest() {
        return ok(dashboardTest.render());
    }
    
    public static Result mostBuyedItems(Long sellerId){    	
    	List<Item> items = Item.findItemsOwnedBy(sellerId);
    	
		return ok(Json.toJson(items));
    }

}
