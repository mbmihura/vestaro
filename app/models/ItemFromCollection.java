package models;

import java.util.ArrayList;
import java.util.List;

import play.db.ebean.Model;

@SuppressWarnings("serial")
public class ItemFromCollection extends Model {
	    
		public Long id;
		public String title;
		public String description;
		public List<Item> items = new ArrayList<Item>();
		
		public ItemFromCollection(Collection collection){
			super();
			this.id = collection.id;
			this.title = collection.title;
			this.description = collection.description;
		}
}
