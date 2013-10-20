package models;

import java.sql.Timestamp;
import java.util.Comparator;
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
public class WishlistItem extends Model {
    @Id
    public String id;

    @OneToOne
    public Item item;
    
    @OneToOne
    public User owner;
    
    @CreatedTimestamp
    Timestamp create_time;

    @Version
    Timestamp update_time;
	
    public static Finder<String,WishlistItem> find = new Finder<String,WishlistItem>(String.class, WishlistItem.class);
    
    public WishlistItem(Item item, User user) {
    	this.item = item;
    	this.owner = user;
    }

    public static List<WishlistItem> findItemsOwnedBy(Long userId){
        return WishlistItem.find
        		.where()
                	.eq("owner.id", userId)
                .findList();
    }
    
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Item [id=")
                .append(id)
                .append(", owner=")
                .append(owner.name)
                .append(", item=")
                .append(item.title)
                .append(", create_time=")
                .append(create_time)
                .append(", update_time=")
                .append(update_time)
                .append("]");
        return builder.toString();
    }

}
