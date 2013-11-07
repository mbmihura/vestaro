
package controllers;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import models.Action;
import models.BuyOrder;
import models.Collection;
import models.CollectionItems;
import models.Item;
import models.Seller;
import models.Stock;
import play.libs.Json;
import play.mvc.Result;

/*TODO replace sellerId with this.currentUserId();*/
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

    	List<Stock> lowStockItems = new ArrayList<Stock>();
    	List<Item> items = Item.findItemsOwnedBy(seller.id);
    	
		for(Item item : items){
			for(Stock stock : Stock.findStockOfItem(item.id)){
				if(stock.stock <= 5)
					lowStockItems.add(stock);
			}
		}
    	
    	return ok(Json.toJson(lowStockItems));
    }
    
    public static Result sellerCommission(){
    	
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	Calendar calendar = Calendar.getInstance();
    	return ok(Json.toJson(BuyOrder.getSellerComissions(seller.id, calendar.get(Calendar.MONTH), calendar.get(Calendar.YEAR)) ));
    }

}
