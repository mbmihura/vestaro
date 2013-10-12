package models;

import java.util.ArrayList;
import java.util.List;

public class CollectionDashboard {
	public Long id;
	public String title;
	public String description;
	public List<Item> items = new ArrayList<Item>();
	public Integer itemsCount;
	
	public CollectionDashboard(Collection collection){
		super();
		this.id = collection.id;
		this.title = collection.title;
		this.description = collection.description;
		this.items = Item.findItemsFromCollection(collection.id);
	}
}