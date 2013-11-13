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

    @Constraints.Required
    @Formats.NonEmpty
    public String description;

    @OneToOne
    public Seller seller;

    public static Finder<Long,Collection> find = new Finder<Long,Collection>(Long.class,Collection.class);
    
    public Collection(Long collectionId, String collectionTitle, String collectionDescription){
		super();
		this.id = collectionId;
		this.title = collectionTitle;
		this.description = collectionDescription;
	}
    
    public static List<Collection> findCollectionsOwnedBy(Long sellerId){
        return find.where()
                .eq("seller.id", sellerId)
                .findList();
    }
    
    public static Collection submit(Collection collection) {
    	if(collection.seller == null){
    		collection.seller = Seller.find.byId((long)1);
    	}
    	collection.save();
    	return collection;
    }
    
    public static Collection update(Collection collection) {
    	collection.update();
    	return collection;
    }
    
    public static Collection delete(Long collectionId) {
    	Collection collection = find.byId(collectionId);
    	collection.delete();
    	return new Collection(collectionId, null, null);
    }
}
