package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.db.ebean.Model;
import security.Roles;
import controllers.routes;

@Entity
public class Seller extends Model {

	private static final long serialVersionUID = 2293136860329930788L;
	
	@Id
    public Long id;
    @OneToOne
    public User user;
    public String brandName;
    public boolean pointsEnabled = false;
    public Double pointMoneyRelation = 1.0;	 

    public String mp_client_secret;
    public String mp_client_id;
    
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
    
    public static Seller findSellerByUser(Long user){
    	return Seller.find.where()
    			.eq("user.userId", user)
    			.findUnique();
    }
    
    
    
    
    

    /**
     * Creates a new seller in the DB and set default values, for the given user. This methods should be call to register a new seller in the system.
     * @param fbUserId The user's id for which the seller entity is being created.
     * @return The new seller entity.
     */
    public static Seller createFor(Long fbUserId) {
		User user = User.findById(fbUserId);
		user.addRoles(Roles.SELLER);
		user.save();
    	//TODO: throws ex in user not find or automaticaly register?
    	Seller newSeller = new Seller(User.findById(fbUserId));
    	newSeller.save();
    	return newSeller;
		
	}
    
    /**
     * Creates a seller instance with default values.
     * @param user The user entity for which the seller entity is being created.
     * @return The new seller entity.
     */
    private Seller(User user) {
    	this.id = 4L; //TODO: averiguar por que buyer acepta id nulos y seller no.
		this.user = user;
		this.brandName = user.name;
		this.logoUrl = Seller.DefaultLogoUrl;
		this.pointsEnabled = false;
		
		//TODO set default values for points ans mercado pago
	}
    
    /**
     * Default logo's url for when a new seller is created.
     */
    public static String DefaultLogoUrl = routes.Assets.at("img/globals-business/paperTag.jpg").url();
}
