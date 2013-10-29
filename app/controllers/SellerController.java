package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Collection;
import models.CollectionItems;
import models.Item;
import models.Seller;
import play.libs.Json;
import play.mvc.Result;

public class SellerController extends BaseController {
    
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
    
    public static Result findSellerById(Long sellerId) {
    	return ok(Json.toJson(Seller.find.byId(sellerId)));
    }
    
    public static Result update(Long sellerID, String logoURL, String name, String pageURL, Boolean pointsEnabled, Double pointMoneyRelation) {
        return ok(Json.toJson(Seller.update(new Seller(sellerID, logoURL, name, pageURL, pointsEnabled, pointMoneyRelation))));
    }
}
