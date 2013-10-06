package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

@Entity
public class BuyOrder extends Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1513729214739166615L;
	@Id 
	public Long id;
	public Item item;
	public Long price;
	public Buyer buyer;
	
	
	
	
	public BuyOrder(Item item,Buyer buyer){
		this.item = item;
		this.price = item.price;
		this.buyer = buyer;
		this.save();
	}
	
	
	
}
