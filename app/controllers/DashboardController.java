
package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Collection;
import models.Item;
import models.Stock;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboard.dashboardTest;
import views.html.dashboard.dashboard;

public class DashboardController extends BaseController {
  
    public static Result dashboardTest() {
        return ok(dashboardTest.render());
    }
        
    public static Result biggestCollections(Long sellerId){    	
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	
		for(Collection collection : collections){
			collection.itemsCount = collection.items.size();
		}
    	
    	return ok(Json.toJson(collections));
    }
    
    public static Result allItemsFromAlbums(Long sellerId){
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<Item> allItems = new ArrayList<Item>();
    	
    	for(Collection collection : collections){    		
    		allItems.addAll(collection.items);
    	}
    	
    	return ok(Json.toJson(allItems));
    }
    
    public static Result littleItemsStock(Long sellerId){
    	List<Stock> lowStockItems = new ArrayList<Stock>();
    	List<Item> items = Item.findItemsOwnedBy(sellerId);
    	
		for(Item item : items){
			for(Stock stock : Stock.findStockOfItem(item.id)){
				if(stock.stock <= 5)
					lowStockItems.add(stock);
			}
		}
    	
    	return ok(Json.toJson(lowStockItems));
    }
    
    public static Result dashboard() {
        return ok(dashboard.render());
 }
}
