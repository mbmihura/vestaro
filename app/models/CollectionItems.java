package models;

import java.util.List;

public class CollectionItems {
	 
	    public Long id;
	    public String title;
	    public String description;
	    public List<Item> items;
	    
	    public CollectionItems(Long id, String title, String description){
	    	super();
	    	this.id = id;
	    	this.title = title;
	    	this.description = description;
	    }
}
