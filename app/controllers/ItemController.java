package controllers;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import models.BuyOrder;
import models.Buyer;
import models.Category;
import models.Collection;
import models.InvalidBuyOrderException;
import models.Item;
import models.PaymentManager;
import models.StockPerSize;

import org.codehaus.jettison.json.JSONException;

import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.RestrictTo;
import security.Roles;
import views.html.items.form;
import views.html.items.item;

public class ItemController extends BaseController {
    
	private static final int UNPROCESSABLE_ENTITY = 422;
	static Form<Item> itemForm = Form.form(Item.class);
		
	@Deprecated
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
	
    /***
     * Returns Json of a given item.
     */
    public static Result read(String itemId) {
    	Item item = Item.find.byId(itemId);
    	if(item != null) {    		
    		return ok(Json.toJson(item));
    	} else {
    		return notFound();
    	}
    }
    
    /***
     * Returns a list of all items in Json.
     * ownerUser: if present and != null, list only contains items in which its seller fbuserid is equal to the one in ownerUser
     */
    public static Result readAll() {
    	DynamicForm data = Form.form().bindFromRequest();
    	String userId = data.get("ownerUser");
		if (userId != null && !userId.isEmpty()){
			Long id;
			if (userId.equalsIgnoreCase("currentUser")) 
				id = currentUserId(); 
			else
				id = Long.parseLong(userId);
			List<Item> items = Item.findItemsOwnedByUser(id);
			return ok(Json.toJson(items));
		}
		else
			return ok(Json.toJson(Item.find.all()));
    }
    
    /***
     * Updates (and if does not exists creates) an item. All params are optionally, only the ones present in the request will be updated.
     * @return 201 Created: if item already existed, 200 OK: if item didn't exist and was created.
     */
    @RestrictTo(Roles.SELLER)
    public static Result createOrUpdate(String id) {
    	Item item = Item.find.byId(id); // TODO validate item owner is current user, if not return forbiden
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
		
        // TODO if .save fails return correct http status code: return badRequest();
		item.save();
		if (created) {
			return created(Json.toJson(item));
		} else {
            return ok(Json.toJson(item));
		}
    }

    @RestrictTo(Roles.SELLER)
    public static Result updateItem(Long collectionId, String itemId) {
    	// validate item owner is current user, if not forbiden
    	Item item = Item.find.byId(itemId);
    	item.collection = collectionId == null ? null : Collection.find.byId(collectionId);
        return ok(views.html.items.item.render(Item.update(item)));
    }
    
    /***
     * Deletes given item and all their stock info.
     */
    @RestrictTo(Roles.SELLER)
    public static Result delete(String itemId) {
    	Item item = Item.find.byId(itemId); // TODO validate item owner is current user, if not forbiden
        if(item != null) {          
            item.deleteCascade();
            return noContent();
        } else {
            return notFound();
        }
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

    @RestrictTo(Roles.BUYER)
    public static Result buy(){
        String itemId = Form.form().bindFromRequest().get("id");
    	Item item = Item.find.byId(itemId);
    	if (item != null) {	
    		LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
    	    for(StockPerSize sizeStock: item.getAvailableStock()) {
    	    	options.put(sizeStock.id.toString(), sizeStock.size);
    	    }    	        
	        return ok(views.html.buyItem.render(item,options ,Buyer.findBuyerByUser(currentUserId()).points));
    	} else {
    		return badRequest("item not found");
    		// TODO should be 422 as it's a smantic error not sintax. Does plays allow to return a 422?
    	}
    }
    
    @RestrictTo(Roles.BUYER)
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
			play.Logger.error(e.getMessage());
			return badRequest();
		} catch (Exception e) {
			play.Logger.error(e.getMessage());
			return badRequest();
		}
    }
    
    public static Result getItemsByList(){
        try {
			DynamicForm data = Form.form().bindFromRequest();
			String itemsStr = data.get("items");
			String[] itemsId = itemsStr.split(",");
			List<Item> items = new ArrayList<Item>();
			
			for (int i = 0; i < itemsId.length; i++) {
				items.add(Item.find.byId(itemsId[i]));
			}
			
			return ok(Json.toJson(items));
		} catch (Exception e) {
			play.Logger.error(e.getMessage());
			return badRequest(e.getMessage());
		}
    }

    public static Result getCategories(){
        return ok(Json.toJson(Category.find.all()));
    }
}
