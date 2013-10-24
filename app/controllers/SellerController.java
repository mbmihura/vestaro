package controllers;

import java.util.List;

import models.Item;
import play.libs.Json;
import play.mvc.Result;

public class SellerController extends BaseController {
    
	public static Result itemsOwnedBy(Long sellerId){
		List<Item> items = Item.findItemsOwnedBy(sellerId);
		return ok(Json.toJson(items));
	}
    
    public static Result listCollections(Long sellerId) {
    	return TODO;
    }
}
