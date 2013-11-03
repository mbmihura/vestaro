package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.db.ebean.Model;
import security.Roles;

@Entity
public class Buyer extends Model {

	private static final long serialVersionUID = -8300896290681569643L;
	
	@Id
    public Long id;
	@OneToOne
	public User user;
	public Integer points = 0; 
	public String mail ="test@gmail.com";
    
	public static Finder<Long,Buyer> find = new Finder<Long,Buyer>(Long.class,Buyer.class);
	
	public static Buyer findBuyerByUser(Long user){
	  return Buyer.find.where()
    			.eq("user.userId", user)
    			.findUnique();
    }
	
	public Buyer(User user){
		this.user = user;
		this.points=0;
	}
	public Buyer(){
		
	}
	
	/**
     * Creates new buyers, related User entity, and set default values. This methods should be call when a new user register into the system as a buyer.
     * @param fbUserId User facebook's id, name User's real name (as display in facebook).
     * @return The user's new seller entety.
     */
    public static Buyer create(Long fbUserId, String name) {
    	User user = User.create(fbUserId, name, Roles.BUYER);
    	Buyer newBuyer = new Buyer(user);
    	newBuyer.save();
    	return newBuyer;
    }
}
