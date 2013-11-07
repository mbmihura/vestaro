package models;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Version;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import com.avaje.ebean.annotation.CreatedTimestamp;

@SuppressWarnings("serial")
@Entity
public class Item extends Model {
    @Id
    public String id;

    @Constraints.Required
    @Constraints.MaxLength(30)
    public String title;

    @Constraints.Required
    @Constraints.MaxLength(100)
    public String description;

    @Constraints.Required
    public String imgUrl;
    
    @Constraints.Required
    public Long price;
    
    @Constraints.Required
    @Constraints.MaxLength(10)
    public String sex;
    
    //TODO Change Object type to Stock
//    public List<String> stocks = new ArrayList<>();

    @OneToOne
    public Seller seller;

    @OneToOne
    public Collection collection;
    
    @CreatedTimestamp
    Timestamp create_time;

    @Version
    Timestamp update_time;

	public Integer views;
	public Integer purchases;
	
    public static Finder<String,Item> find = new Finder<String,Item>(String.class, Item.class);

    public static List<Item> findItemsOwnedBy(Long sellerId){
        return Item.find
        		.select("id, title, description, imgUrl, price, views, purchases")
        		.fetch("collection", "id, title, description")
        		.where()
                	.eq("seller.id", sellerId)
                .findList();
    }
    
    public Item(String id) //TODO Diff entre id y Title?
    {
    	this.id = id;
    }
    public static List<Item> findItemsFromCollection(Long collectionId){
    	return Item.find.where()
                .eq("collection.id", collectionId)
                .findList();
    }
    
    public static List<Item> findItemsWithNoCollection(Long sellerId){
    	return Item.find.where()
    			.eq("seller.id", sellerId)
                .isNull("collection.id")
                .findList();
    }

    public static boolean isOwner(String itemId, Long sellerId){
        return Item.find.where()
                .eq("id", itemId)
                .eq("seller.id", sellerId)
                .findRowCount() > 0;
    }

    public static Item create(Item item, Long ownerId) {
        item.seller = Seller.find.ref(ownerId);
        item.save();
        return item;
    }
    
    

    public static Item update(Item item) {
    	item.update();
    	return item;
    }
    
    public static Item submit(Item item) {
    	if(item.seller == null){
    		item.seller = Seller.find.byId((long)1);
    	}
    	item.save();
    	return item;
    }
    
    public LinkedHashMap<String, String> getAvailableStock(){
    	return Stock.findAvailableSizeOptions(id);
    }
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Item [id=")
                .append(id)
                .append(", title=")
                .append(title)
                .append(", owner=")
                .append(seller.brandName)
                .append(", price=")
                .append(price)
                .append(", sex=")
                .append(sex)
                .append(", create_time=")
                .append(create_time)
                .append(", update_time=")
                .append(update_time)
                .append("]");
        return builder.toString();
    }
    
    public static class Comparators {

        public static Comparator<Item> mostPurchases = new Comparator<Item>() {
            @Override
            public int compare(Item o1, Item o2) {
                return o2.purchases.compareTo(o1.purchases);
            }
        };
        
        public static Comparator<Item> mostViews = new Comparator<Item>() {
            @Override
            public int compare(Item o1, Item o2) {
                return o2.views.compareTo(o1.views);
            }
        };
        
        public static Comparator<Item> lessPurchases = new Comparator<Item>() {
            @Override
            public int compare(Item o1, Item o2) {
                return o1.purchases.compareTo(o2.purchases);
            }
        };
        
        public static Comparator<Item> lessViews = new Comparator<Item>() {
            @Override
            public int compare(Item o1, Item o2) {
                return o1.views.compareTo(o2.views);
            }
        };
    }

	public LinkedHashMap<String, String> getMockAvailableStock() {
		LinkedHashMap<String, String> availableStockSize = new LinkedHashMap<String,String>();
		availableStockSize.put("S", "Small");
		availableStockSize.put("M", "Medium");
		availableStockSize.put("L", "Large");
		return availableStockSize;
	}

}
