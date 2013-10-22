package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Collection;
import models.CollectionItems;
import models.Item;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.RestrictTo;
import security.Roles;
import views.html.collections.collection;
import views.html.collections.collectionForm;
import views.html.collections.form;

@RestrictTo(Roles.SELLER)
public class CollectionController extends BaseController {

	static Form<Collection> formCollection = Form.form(Collection.class);
	
	public static Result collectionForm() {
        return ok(collectionForm.render());
    }
	
	public static Result form() {
        return ok(form.render(formCollection));
    }
	
	public static Result getItemsFromCollection(Long collectionId){
		//User user = currentUser();
		
		return ok(Json.toJson(Item.findItemsFromCollection(collectionId)));
		
	}
	
	public static Result getItemsWithNoCollection(Long sellerId){
		return ok(Json.toJson(Item.findItemsWithNoCollection(sellerId)));
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

    public static Result update(Long collectionId, String collectionTitle, String collectionDescription) {
        return ok(collection.render(Collection.update(new Collection(collectionId, collectionTitle, collectionDescription))));
    }
    
    public static Result updateItem(Long collectionId, String itemId) {
    	Item item = Item.find.byId(itemId);
    	item.collection.id = collectionId;
        return ok(views.html.items.item.render(Item.update(item)));
    }
    
    
    public static Result delete(Long collectionId) {
    	return ok(collection.render(Collection.delete(collectionId)));
    }
}
