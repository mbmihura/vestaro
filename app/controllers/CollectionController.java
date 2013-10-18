package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Collection;
import models.CollectionItems;
import models.Item;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.collections.CollectionForm;collectionForm;
import views.html.collections.form;
import views.html.collections.collection;

public class CollectionController extends Controller {

	static Form<Collection> formCollection = Form.form(Collection.class);
	
	public static Result collectionForm() {
        return ok(collectionForm.render());
    }
	
	public static Result form() {
        return ok(form.render());
    }
	
	public static Result getCollections(Long sellerId){
		List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			items.add(new CollectionItems(collection));
		}
    	
    	return ok(Json.toJson(items));
    }
	
	public static Result submit() {
    	Form<Collection> collectionFilledForm = formCollection.bindFromRequest();
    	if(collectionFilledForm.hasErrors()) {
            return badRequest(form.render(collectionFilledForm));
        } else {
            return ok(
                collection.render(Collection.submit(collectionFilledForm.get()))
            );
        }
    }

    public static Result update(Long collectionId) {
    	return TODO;
    }
    
    public static Result delete(Long itemId) {
    	return TODO;
    }
}
