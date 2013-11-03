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
    
    public static Result findCurrentSeller(){
    	return ok(Json.toJson(Seller.findSellerByUser(currentUserId())));
    }
    
    public static Result update(String logoURL, String name, String pageURL,
    							Boolean pointsEnabled, Double pointMoneyRelation, String mp_client_secret, String mp_client_id) {
    	    	
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	
    	seller.brandName = name;
    	seller.logoUrl = logoURL;
    	seller.webpageUrl = pageURL;
    	seller.pointsEnabled = pointsEnabled;
    	seller.pointMoneyRelation = pointMoneyRelation;
    	seller.mp_client_secret = mp_client_secret;
    	seller.mp_client_id = mp_client_id;
    	
        return ok(Json.toJson(Seller.update(seller)));
    }
}
