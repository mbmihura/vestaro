package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import controllers.routes;

import play.api.mvc.Call;
import play.db.ebean.Model;
import security.Roles;

@SuppressWarnings("serial")
@Entity
public class Seller extends Model {
    @Id
    public Long id;
    @OneToOne
    public User user;
    public String brandName;
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
    	this.brandName = name;
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
    
    /**
     * Creates new sellers, related User entity, and set default values. This methods should be call when a new user register into the system as a seller.
     * @param fbUserId User facebook's id, name User's real name (as display in facebook).
     * @return The user's new seller entety.
     */
    public static Seller create(Long fbUserId, String name) {
    	Seller newSeller = new Seller();
    	newSeller.user = User.create(fbUserId, name, Roles.SELLER);
    	newSeller.brandName = name;
    	newSeller.logoUrl = Seller.DefaultLogoUrl;
    	
    	//TODO set default values for points ans mercado pago
    	newSeller.save();
    	return newSeller;
    }
    
    public static Seller findSellerByUser(Long user){
  	  return Seller.find.where()
      			.eq("user.userId", user)
      			.findUnique();
      }
    
    public static String DefaultLogoUrl = routes.Assets.at("img/globals-business/paperTag.jpg").url();
}
