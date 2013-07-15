package models;

import java.util.*;
import javax.persistence.*;
import play.data.format.Formats;
import play.data.validation.Constraints;
import play.db.ebean.Model;

@Entity
public class Item extends Model {
    @Id
    @Constraints.Required
    @Formats.NonEmpty
    //TODO @Constraints.Pattern(value = "\\d{1,6}")
    public String id;

    @Constraints.Required
    @Constraints.MaxLength(30)
    public String title;

    @Constraints.Required
    @Constraints.MaxLength(100)
    public String description;

    @Constraints.Required
    public String imgUrl;

    @OneToOne
    public Seller owner;

    @OneToOne
    public Collection collection;

    public static Finder<String,Item> find = new Finder(String.class, Item.class);

    public static List<Item> findItemsOwnedBy(Long sellerId){
        return Item.find.where()
                .eq("owner.id", sellerId)
                .findList();
    }

    public static boolean isOwner(String itemId, Long sellerId){
        return Item.find.where()
                .eq("id", itemId)
                .eq("owner.id", sellerId)
                .findRowCount() > 0;
    }

    public static Item create(Item item, Long ownerId) {
        item.owner = Seller.find.ref(ownerId);
        item.save();
        return item;
    }

    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Item [id=")
                .append(id)
                .append(", title=")
                .append(title)
                .append(", owner=")
                .append(owner.name)
                .append("]");
        return builder.toString();
    }
}
