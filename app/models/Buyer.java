package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

@Entity
public class Buyer extends Model {

	
    /**
	 * 
	 */
	
	private static final long serialVersionUID = -8300896290681569643L;
	
	 @Id
    public Long id;
    public Long fbUid;
    public String name;
	public String mail = "mail@gmail.com";//TODO: get it from FB 
	public Integer points =0; 
    
	public static Finder<Long,Buyer> find = new Finder<Long,Buyer>(Long.class,Buyer.class);

	
}
