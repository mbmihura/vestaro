package controllers;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.joda.time.DateTime;

import models.Action;
import models.Item;
import models.Seller;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.RestrictTo;
import security.Roles;

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
		
    	return ok(Json.toJson(items.subList(0, 5)));
    }
	
	public static Result getAllTimeActions(String actionType){
		Seller seller = Seller.findSellerByUser(currentUserId());
		List<Item> items = Item.findItemsOwnedBy(seller.id);
		List<DateActions> actions_history = new ArrayList<DateActions>();
				
		for(Item item : items){
			for(Action action : Action.findActionsFrom(actionType, null, null, item.id)){
				if(actions_history.contains(action)){
					actions_history.get(actions_history.indexOf(action)).actions_count = actions_history.get(actions_history.indexOf(action)).actions_count + 1;
				}
				else{
					actions_history.add(new DateActions(action.date));
				}
			}
    	}
		
    	return ok(Json.toJson(actions_history));
	}
	
	 /***
     * Creates an action for the given item.
     */
    @RestrictTo(Roles.BUYER)
    public static Result create(String itemId) {
		DynamicForm data = Form.form().bindFromRequest();
		String type = data.get("type");
		if (type != null && ( type.equals("VIEW") || type.equals("BUY"))){
			new Action(type, currentUserId(), itemId, new Date()).save();
			return noContent();
		} else
			return badRequest();
    }
}
