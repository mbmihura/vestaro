package controllers;

import models.Item;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.items.*;

public class Items extends Controller {
    
	static Form<Item> itemForm = Form.form(Item.class);
	
	public static Result form() {
		return ok(form.render(itemForm));
	}
	
	public static Result itemAjax() {
		return ok(itemAjax.render());
	}
	
    public static Result submit() {
    	Form<Item> itemFilledForm = itemForm.bindFromRequest();
    	if(itemFilledForm.hasErrors()) {
            return badRequest(form.render(itemForm));
        } else {
            return ok(
                item.render(Item.submit(itemFilledForm.get()))
            );
        }
    }
    
    public static Result read(String itemId) {
    	Item item = Item.find.ref(itemId);
    	if(item != null) {
    		return ok(Json.toJson(item));
    	} else {
    		return badRequest();
    	}
    	
    }
    
    public static Result update(String itemId) {
    	//TODO
    	return null;
    }
    
    public static Result delete(String itemId) {
    	//TODO
    	return null;
    }
}
