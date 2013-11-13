
package controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import models.Action;
import models.BuyOrder;
import models.Collection;
import models.CollectionItems;
import models.Item;
import models.StockPerSize;
import models.PaymentManager;
import models.Seller;

import org.codehaus.jettison.json.JSONException;

import play.libs.Json;
import play.mvc.Result;

public class DashboardController extends BaseController {
        
    public static Result biggestCollections(){ 
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	List<Collection> collections = Collection.findCollectionsOwnedBy(seller.id);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			CollectionItems colItems = new CollectionItems(collection);
			items.add(colItems);
		}
    	
    	return ok(Json.toJson(items));
    }
    
    public static Result itemsViewedFromCollections(Long actionDateBegin, Long actionDateEnd){    	
    	Seller seller = Seller.findSellerByUser(currentUserId());

    	List<Collection> collections = Collection.findCollectionsOwnedBy(seller.id);
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
    
    public static Result littleItemsStock(){
    	Seller seller = Seller.findSellerByUser(currentUserId());

    	List<StockPerSize> lowStockItems = new ArrayList<StockPerSize>();
    	List<Item> items = Item.findItemsOwnedBy(seller.id);
    	
		for(Item item : items){
			for(StockPerSize stock : StockPerSize.findStockForItem(item.id)){
				if(stock.quantity <= 5)
					lowStockItems.add(stock);
			}
		}
    	
    	return ok(Json.toJson(lowStockItems));
    }
    

    
  
    
}
