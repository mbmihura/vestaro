package controllers;

import models.Collection;

import java.util.List;
import java.util.ArrayList;

import models.Item;
import play.data.DynamicForm;
import models.BuyOrder;
import models.Buyer;
import models.PaymentManager;
import models.Seller;
import models.Stock;

import org.hibernate.validator.cfg.context.ReturnValueConstraintMappingContext;
import org.codehaus.jettison.json.JSONException;

import play.data.Form;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import views.html.items.form;
import views.html.items.item;

public class ItemController extends BaseController {
    
	static Form<Item> itemForm = Form.form(Item.class);
	
	public static Result form() {
		return ok(form.render(itemForm));
	}
	
    public static Result submit() {
    	Form<Item> itemFilledForm = itemForm.bindFromRequest();
    	if(itemFilledForm.hasErrors()) {
            return badRequest(form.render(itemFilledForm));
        } else {
            return ok(
                item.render(Item.submit(itemFilledForm.get()))
            );
        }
    }
    
    public static Result read(String itemId) {
    	Item item = Item.find.byId(itemId);
    	if(item != null) {
    		/*
    		 * TODO It would be better (RESTfull) if the server returned a json,
    		 * giving the client the power to handle the object the way it wants.
    		 */
    		
    		return ok(views.html.items.item.render(item));
    	} else {
    		return badRequest();
    	}
    	
    }
    
    
    public static Result readAll() {
    	return ok(Json.toJson(Item.find.all()));
    }
    
    public static Result createOrUpdate(String id) {
    	Item item = Item.find.byId(id);
    	boolean created = false;
    	
    	if (item == null) {
    		item = new Item(id);
    		created = true;
    	}
    	
		DynamicForm data = Form.form().bindFromRequest();
        
		String title = data.get("title");
		if (title != null && !title.isEmpty())
			item.title = title;

		String description = data.get("description");
		if (description != null && !description.isEmpty())
			item.description = description;
		
		String imgUrl = data.get("imgUrl");
		if (imgUrl != null && !imgUrl.isEmpty())
			item.imgUrl = imgUrl;
		
		String price = data.get("price");
		if (price != null && !price.isEmpty())
			item.price = Long.parseLong(price);
		
		String sex = data.get("sex");
		if (sex != null && !sex.isEmpty())
			item.sex = sex;
		
		item.save();
		if (created)
		{
			return created(Json.toJson(item));
		}else
		{
        return ok(Json.toJson(item));
		}
    }

    public static Result updateItem(Long collectionId, String itemId) {
    	Item item = Item.find.byId(itemId);
    	item.collection = collectionId == null ? null : Collection.findCollectionsById(collectionId).get(0);
        return ok(views.html.items.item.render(Item.update(item)));
    }
    
    public static Result delete(String itemId) {
    	return TODO;
    }
   
    public static Result itemSearch() {
    	DynamicForm form = Form.form().bindFromRequest();
    	String textSearch = form.get("textSearch");
    	String category = form.get("category");
    	String sex = form.get("sex");
    	
    	List<Item> items = Item.find
    			.where()
    				.ilike("title", "%" + textSearch + "%")
    			.findList();
    	return ok(Json.toJson(items));
    }

     public static Result buy(){
        String itemId = Form.form().bindFromRequest().get("id");
    	Item item = Item.find.byId(itemId);
    	if (item != null) {	
	    	//TODO: Load AvailableStock
	        //return ok(views.html.buyItem.render(item, item.getAvailableStock(),pointsAvailable));
			return ok(views.html.buyItem.render(item, item.getMockAvailableStock(), Buyer.findBuyerByUser(currentUserId()).points));
    	} else {
    		return badRequest("item not found");
    		// TODO: should be 422 as it's a smantic error not sintax. Does plays allow to return a 422?
    	}
    }
    
    public static Result orderItem(String itemId, String size, Integer pointsUsed) throws Exception{
    	Item item = Item.find.byId(itemId);
    	
    	BuyOrder buyOrder  = new BuyOrder();
    	buyOrder.create(buyOrder, item, Buyer.findBuyerByUser(currentUser().userId), size, pointsUsed);

    	PaymentManager manager = new PaymentManager();
    	
		try {
			return ok(Json.toJson(manager.checkout(buyOrder)));
		} catch (JSONException e) {
			return badRequest();//TODO: think what to do when it fails
		} catch (Exception e) {
			return badRequest();//TODO: think what to do when it fails
		}
    }
}
