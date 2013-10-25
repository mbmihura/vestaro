package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.db.ebean.Model;

enum State{PAYMENT_PENDING, RECEPTION_PENDING, RECEPTION_CONFIRMED, IN_DISPUTE}

@Entity
public class BuyOrder extends Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1513729214739166615L;
	@Id 
	public Long id;
	
	@OneToOne
	public Item item;
	public Long price;
	
	@OneToOne
	public Buyer buyer;
	public String size;
	public Integer pointsUsed =0;
	public Integer pointsEarned=0;
	public State state =State.PAYMENT_PENDING;
	
	public BuyOrder(){
		
	}
	public BuyOrder create(BuyOrder order, Item item,Buyer buyer, String size, Integer pointsUsed){
		order.item = item;
		order.price = item.price;
		order.buyer = buyer;
		order.size = size;
		order.pointsUsed = pointsUsed;
		order.save();
		return order;
	}
	
	
    public static Finder<Long,BuyOrder> find = new Finder<Long,BuyOrder>(Long.class, BuyOrder.class);

	public void successfulPayment() {
		this.state = State.RECEPTION_PENDING;
		this.pointsEarned = (int) (this.price - (this.item.seller.pointMoneyRelation *this.pointsUsed));
		//TODO: Use real buyer
		//this.buyer.points +=this.pointsEarned;
		
//		this.buyer.save();
		this.save();
	}

}
