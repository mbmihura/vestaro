package controllers;

import java.util.List;

import models.BuyOrder;
import models.Buyer;
import models.Collection;
import models.InvalidBuyOrderException;
import models.Item;
import models.PaymentManager;

import org.codehaus.jettison.json.JSONException;

import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import views.html.items.form;
import views.html.items.item;

public class ItemController extends BaseController {
    
	private static final int UNPROCESSABLE_ENTITY = 422;
	static Form<Item> itemForm = Form.form(Item.class);
		
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
    		return ok(Json.toJson(item));
    	} else {
    		return notFound();
    	}
    }
    
    public static Result readAll() {
    	return ok(Json.toJson(Item.find.all()));
    }
    
    public static Result createOrUpdate(String id) {
    	Item item = Item.find.byId(id); // validate item owner is current user, if not forbiden
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
		
        // if .save fails return correct http status code: return badRequest();
		item.save();
		if (created) {
			return created(Json.toJson(item));
		} else {
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
	        return ok(views.html.buyItem.render(item, item.getAvailableStock(),Buyer.findBuyerByUser(currentUserId()).points));
    	} else {
    		return badRequest("item not found");
    		// TODO: should be 422 as it's a smantic error not sintax. Does plays allow to return a 422?
    	}
    }
    
    public static Result orderItem(String itemId, String size, Integer pointsUsed) throws Exception{
    	Item item = Item.find.byId(itemId);
    	
    	BuyOrder buyOrder  = new BuyOrder();

    	try{
    		buyOrder.create(buyOrder, item, Buyer.findBuyerByUser(currentUser().userId), size, pointsUsed);

    	}
    	catch(InvalidBuyOrderException exception){
    		return status(UNPROCESSABLE_ENTITY);
    	}
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
