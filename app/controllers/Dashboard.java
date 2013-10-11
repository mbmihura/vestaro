
package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Collection;
import models.Item;
import models.ItemFromCollection;
import models.Stock;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboard.dashboardTest;
import views.html.dashboard.dashboard;

public class Dashboard extends Controller {
  
    public static Result dashboardTest() {
        return ok(dashboardTest.render());
    }
        
    public static Result biggestCollections(Long sellerId){    	
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	
		for(Collection collection : collections){
			collection.items = Item.findItemsFromCollection(collection.id).size();
		}
    	
    	return ok(Json.toJson(collections));
    }
    
    public static Result allItemsFromAlbums(Long sellerId){
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<ItemFromCollection> items = new ArrayList<ItemFromCollection>();
    	
    	for(Collection collection : collections){    		
    		ItemFromCollection item = new ItemFromCollection(collection);
    		item.items = Item.findItemsFromCollection(collection.id);
    		items.add(item);
    		
    	}
    	
    	return ok(Json.toJson(items));
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
