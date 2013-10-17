package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Collection;
import models.CollectionItems;
import models.Item;
import models.Seller;
import play.libs.Json;
import play.mvc.Result;
import views.html.sellers.sellerItems;

public class SellerController extends BaseController {
  
    public static Result listItems(Long sellerId) {
        return ok(sellerItems.render(
        	Seller.find.ref(sellerId),
        	Item.findItemsOwnedBy(sellerId)
        ));
    }
    
	public static Result itemsOwnedBy(Long sellerId){
		List<Item> items = Item.findItemsOwnedBy(sellerId);
		return ok(Json.toJson(items));
	}
    
    public static Result listCollections(Long sellerId) {
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			items.add(new CollectionItems(collection));
		}
    	
    	return ok(Json.toJson(items));
    }
}
