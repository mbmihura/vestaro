package controllers;

import java.util.List;

import models.Collection;
import models.Item;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboard.dashboardTest;

public class Dashboard extends Controller {
  
    public static Result dashboardTest() {
        return ok(dashboardTest.render());
    }
    
    public static Result mostBuyedItems(Long sellerId){    	
    	List<Item> items = Item.findItemsOwnedBy(sellerId);
		return ok(Json.toJson(items));
    }
    
    public static Result biggestCollections(Long sellerId){    	
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	
		for(Collection collection : collections){
			collection.items = Item.findItemsFromCollection(collection.id).size();
		}
    	
    	return ok(Json.toJson(collections));
    }
}
