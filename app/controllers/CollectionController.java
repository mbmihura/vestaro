package controllers;

import java.util.ArrayList;
import java.util.List;

import models.Collection;
import models.CollectionItems;
import models.Item;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.collections.CollectionForm;

public class CollectionController extends Controller {
	public static Result CollectionForm() {
        return ok(CollectionForm.render());
    }
	
	public static Result getCollections(Long sellerId){
		List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			CollectionItems collectionItems = new CollectionItems(collection.id, collection.title, collection.description);
			collectionItems.items = Item.findItemsFromCollection(collection.id);
			items.add(collectionItems);
		}
    	
    	return ok(Json.toJson(items));
    }
}
