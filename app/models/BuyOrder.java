package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

enum Estado{PAYMENT_PENDING, RECEPTION_PENDING, RECEPTION_CONFIRMED, IN_DISPUTE}

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
	public String size;
	public Integer pointsUsed =0;
	public Integer pointsEarned=0;
	public Estado estado =Estado.PAYMENT_PENDING;
	
	public BuyOrder(){
		
	}
	public BuyOrder(Item item,Buyer buyer, String size){
		this.item = item;
		this.price = item.price;
		this.buyer = buyer;
		this.size = size;
		this.save();
	}
	
	
	
}
