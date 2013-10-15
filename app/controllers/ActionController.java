package controllers;

import java.util.Collections;
import java.util.List;

import models.Action;
import models.Item;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class ActionController extends Controller {
	
	public static Result actionsFrom(Long order, Long sellerId, Long actionDateBegin, Long actionDateEnd, String actionType){
		if(order > 0)
			return mostActionsFrom(sellerId, actionDateBegin, actionDateEnd, actionType);
		else
			return lessActionsFrom(sellerId, actionDateBegin, actionDateEnd, actionType);
	}
	
	private static Result mostActionsFrom(Long sellerId, Long actionDateBegin, Long actionDateEnd, String actionType){
		List<Item> items = Item.findItemsOwnedBy(sellerId);
		for(Item item : items){
			if(actionType.equals("BUY"))
				item.purchases = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
			else if(actionType.equals("VIEW"))
				item.views = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
    	}
		
		Collections.sort(items, actionType.equals("BUY") ? Item.Comparators.mostPurchases : Item.Comparators.mostViews);
		
    	return ok(Json.toJson(items.subList(0, 5)));
    }
	
	private static Result lessActionsFrom(Long sellerId, Long actionDateBegin, Long actionDateEnd, String actionType){
		List<Item> items = Item.findItemsOwnedBy(sellerId);
		for(Item item : items){
			if(actionType.equals("BUY"))
				item.purchases = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
			else if(actionType.equals("VIEW"))
				item.views = Action.findActionsFrom(actionType, actionDateBegin, actionDateEnd, item.id).size();
    	}
		
		Collections.sort(items, actionType.equals("BUY") ? Item.Comparators.lessPurchases : Item.Comparators.lessViews);
		
    	return ok(Json.toJson(items.subList(0, 5)));
    }
	
}
