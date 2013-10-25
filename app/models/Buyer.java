package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.db.ebean.Model;

@Entity
public class Buyer extends Model {

	
    /**
	 * 
	 */
	
	private static final long serialVersionUID = -8300896290681569643L;
	
	 @Id
    public Long id;
	 @OneToOne
	public User user;
	public Integer points =0; 
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
	
	public Buyer create(User user){
		Buyer buyer = new Buyer(user);
		buyer.save();
		return buyer;
	}
}
