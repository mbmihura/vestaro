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
	
	
	public Buyer(){
		
	}
	
	/**
     * Creates new buyers, related User entity, and set default values. This methods should be call when registering a new buyer into the system.
     * @param user The userś id for which the buyer entity is being created.
     * @return The new buyer entity.
     */
	public static Buyer createFor(Long fbUserId) {
		User user = User.findById(fbUserId);
		user.addRoles(Roles.BUYER);
		user.save();
		//TODO: throws ex in user not find or automaticaly register?
    	Buyer newBuyer = new Buyer(user);
    	newBuyer.save();
    	return newBuyer;
	}
	
    /**
     * Creates a buyer instance with default values.
     * @param user The user entity for which the buyer entity is being created.
     * @return The new buyer entity.
     */
	private Buyer(User user){
		this.user = user;
		this.points=0;
	}
}
