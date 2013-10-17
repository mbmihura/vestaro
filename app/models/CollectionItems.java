package models;

import java.util.ArrayList;
import java.util.List;

public class CollectionItems {
	public Long id;
	public String title;
	public String description;
	public List<Item> items = new ArrayList<Item>();
	public Integer itemsCount;
	
	public CollectionItems(Collection collection){
		super();
		this.id = collection.id;
		this.title = collection.title;
		this.description = collection.description;
		this.items = Item.findItemsFromCollection(collection.id);
		this.itemsCount = this.items.size();
	}
}