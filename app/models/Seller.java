package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Seller extends Model {
    @Id
    public Long id;
    @OneToOne
    public User user;
    public String name;
    public boolean pointsEnabled = false;
    public Double pointMoneyRelation = 1.0;	 

    public String mp_client_secret; // ="uToiGVlNavrrbtjFX6ksHP51RQsG5and";//TEST_CLIENT_SECRET
    public String mp_client_id; // = "1406963671517811";//TEST_CLIENT_ID
    
    public String logoUrl;
    public String webpageUrl;

    public Seller(){
    }
    
    public Seller(User user, Long sellerID, String logoURL, String name, String pageURL,
    				Boolean pointsEnabled, Double pointMoneyRelation, String mp_client_secret, String mp_client_id){
    	this.user = user;
    	this.id = sellerID;
    	this.name = name;
    	this.logoUrl = logoURL;
    	this.webpageUrl = pageURL;
    	this.pointsEnabled = pointsEnabled;
    	this.pointMoneyRelation = pointMoneyRelation;
    	this.mp_client_secret = mp_client_secret;
    	this.mp_client_id = mp_client_id;
    }
    
    public static Finder<Long,Seller> find = new Finder<Long,Seller>(Long.class,Seller.class);

    public static Seller update(Seller seller) {
    	seller.update();
    	return seller;
    }
    
    public static Seller create(Seller seller) {
    	seller.save();
    	return seller;
    }
    
    public static Seller findSellerByUser(Long user){
  	  return Seller.find.where()
      			.eq("user.userId", user)
      			.findUnique();
      }
}
