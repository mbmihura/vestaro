
package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Action;
import models.Collection;
import models.CollectionItems;
import models.Item;
import models.StockPerSize;
import play.libs.Json;
import play.mvc.Result;

/*TODO replace sellerId with this.currentUserId();*/
public class DashboardController extends BaseController {
        
    public static Result biggestCollections(Long sellerId){    	
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			CollectionItems colItems = new CollectionItems(collection);
			items.add(colItems);
		}
    	
    	return ok(Json.toJson(items));
    }
    
    public static Result itemsViewedFromCollections(Long sellerId, Long actionDateBegin, Long actionDateEnd){    	
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			CollectionItems collectionItems = new CollectionItems(collection);
			
			for(Item item : collectionItems.items){
				item.views = Action.findActionsFrom("VIEW", actionDateBegin, actionDateEnd, item.id).size();
			}
			
			items.add(collectionItems);
		}
    	
    	return ok(Json.toJson(items));
    }
    
    public static Result littleItemsStock(Long sellerId){
    	List<StockPerSize> lowStockItems = new ArrayList<StockPerSize>();
    	List<Item> items = Item.findItemsOwnedBy(sellerId);
    	
		for(Item item : items){
			for(StockPerSize stock : StockPerSize.findStockForItem(item.id)){
				if(stock.quantity <= 5)
					lowStockItems.add(stock);
			}
		}
    	
    	return ok(Json.toJson(lowStockItems));
    }

}
