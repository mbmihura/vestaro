package controllers;

import java.util.Collections;
import java.util.List;

import models.Action;
import models.Item;
import models.Seller;
import play.libs.Json;
import play.mvc.Result;

public class ActionController extends BaseController {
	
	public static Result actionsFrom(Long order,  Long actionDateBegin, Long actionDateEnd, String actionType){
		if(order > 0)
			return mostActionsFrom( actionDateBegin, actionDateEnd, actionType);
		else
			return lessActionsFrom( actionDateBegin, actionDateEnd, actionType);
	}
	
	private static Result mostActionsFrom( Long actionDateBegin, Long actionDateEnd, String actionType){
		Seller seller = Seller.findSellerByUser(currentUserId());
		List<Item> items = Item.findItemsOwnedBy(seller.id);
		for(Item item : items){
			if(actionType.equals("BUY"))
				item.purchases = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
			else if(actionType.equals("VIEW"))
				item.views = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
    	}
		
		Collections.sort(items, actionType.equals("BUY") ? Item.Comparators.mostPurchases : Item.Comparators.mostViews);
		
    	return ok(Json.toJson(items.size() > 5 ? items.subList(0, 5) : items));
    }
	
	private static Result lessActionsFrom( Long actionDateBegin, Long actionDateEnd, String actionType){
		Seller seller = Seller.findSellerByUser(currentUserId());
		List<Item> items = Item.findItemsOwnedBy(seller.id);
		for(Item item : items){
			if(actionType.equals("BUY"))
				item.purchases = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
			else if(actionType.equals("VIEW"))
				item.views = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
    	}
		
		Collections.sort(items, actionType.equals("BUY") ? Item.Comparators.lessPurchases : Item.Comparators.lessViews);
		
    	return ok(Json.toJson(items.size() > 5 ? items.subList(0, 5) : items));
    }
	
}
