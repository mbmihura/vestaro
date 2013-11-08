
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
import models.PaymentManager;
import models.Seller;
import models.Stock;

import org.codehaus.jackson.JsonNode;
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
    
    public static Result sellerCommission() {
    	
    	HashMap<String, Object> responseMap = new LinkedHashMap<String, Object>();
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	Double commissionValue= BuyOrder.getSellerComissions(seller.id) ;
    	responseMap.put("commissionValue", commissionValue);
    	
    	if(commissionValue >0){
    		PaymentManager manager = new PaymentManager();
    		try {
    			String commissionCheckOutUrl= manager.commissionCheckoutUrl(commissionValue);
    			responseMap.put("commissionCheckoutUrl", commissionCheckOutUrl);
    			
    		} catch (JSONException e) {
    			// TODO Auto-generated catch block
    			e.printStackTrace();
    		}catch (Exception e) {
    			// TODO: handle exception
    		}
    		
    	}
    	
    	return ok(Json.toJson(responseMap));
    }

    public static Result commissionDetail(){
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	return ok(Json.toJson(BuyOrder.getCommissionsDetail(seller.id)) );
    }
    
  
    
}
