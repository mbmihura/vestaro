package models;

import javax.persistence.*;

import org.joda.time.DateTime;

import play.data.format.Formats;
import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Seller extends Model {
    @Id
    public Long id;
    public Long fbUid;
    public String name;
    public boolean pointsEnabled = false;
    public Double pointMoneyRelation = 1.0;	 

    public String mp_client_secret; // ="uToiGVlNavrrbtjFX6ksHP51RQsG5and";//TEST_CLIENT_SECRET
    public String mp_client_id; // = "1406963671517811";//TEST_CLIENT_ID
    
    public String logoUrl;
    public String webpageUrl;
    @Formats.DateTime(pattern="yyyy-MM-dd hh:mm:ss")
    public DateTime insertDate = new DateTime();
    public SellerPoint activeSellerPoint;

    public Seller(){
    	super();
    }
    
    public Seller(Long sellerID, String logoURL, String name, String pageURL, Boolean pointsEnabled, Double pointMoneyRelation){
    	super();
    	this.id = sellerID;
    	this.name = name;
    	this.logoUrl = logoURL;
    	this.webpageUrl = pageURL;
    	this.pointsEnabled = pointsEnabled;
    	this.pointMoneyRelation = pointMoneyRelation;
    }
    
    public static Finder<Long,Seller> find = new Finder<Long,Seller>(Long.class,Seller.class);

    public static Seller update(Seller seller) {
    	seller.update();
    	return seller;
    }
}
