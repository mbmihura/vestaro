package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.data.format.Formats;
import play.data.validation.Constraints;
import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Collection extends Model {
    @Id
    public Long id;

    @Constraints.Required
    @Formats.NonEmpty
    public String title;

    public String description;
    
    //public List<Item> items;
    public Integer item_count;

    @OneToOne
    public Seller seller;

    public static Finder<Long,Collection> find = new Finder<Long,Collection>(Long.class,Collection.class);
    
    public static List<Collection> findCollectionsOwnedBy(Long sellerId){
        return Collection.find.where()
                .eq("seller.id", sellerId)
                .findList();
    }
}
