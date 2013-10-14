
package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Action;
import models.Collection;
import models.CollectionItems;
import models.Item;
import models.Stock;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboard.dashboard;
import views.html.dashboard.dashboardTest;

public class Dashboard extends Controller {
  
    public static Result dashboardTest() {
        return ok(dashboardTest.render());
    }
        
    public static Result biggestCollections(Long sellerId){    	
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	
		for(Collection collection : collections){
			collection.item_count = Item.findItemsFromCollection(collection.id).size();
		}
    	
    	return ok(Json.toJson(collections));
    }
    
    public static Result itemsViewedFromCollections(Long sellerId, Long actionDateBegin, Long actionDateEnd){    	
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			CollectionItems collectionItems = new CollectionItems(collection.id, collection.title, collection.description);
			collectionItems.items = Item.findItemsFromCollection(collection.id);
			
			for(Item item : collectionItems.items){
				item.views = Action.findActionsFrom("VIEW", actionDateBegin, actionDateEnd, item.id).size();
			}
			
			items.add(collectionItems);
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
