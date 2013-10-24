package controllers;

import java.util.List;

import models.Item;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
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
    
    public static Result index() {
    	return ok(Json.toJson(Item.find.all()));
    }
    
    public static Result update(String itemId) {
    	return TODO;
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

}
