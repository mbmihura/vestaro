package models;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Version;

import play.db.ebean.Model;

import com.avaje.ebean.annotation.CreatedTimestamp;


@Entity
public class BuyOrder extends Model{
	
	private static final double COMMISSION_PERCENT = 0.04;


	public enum State{
		PAYMENT_PENDING("Pendiente de pago", "Pagar","window.location.href = '/#/buyer/pay?id="),
		RECEPTION_PENDING("Pendiente de recepción", "Confirmar recepción","confirmReception"),
		RECEPTION_CONFIRMED("Recepción confirmada","",""),
		IN_DISPUTE("En disputa","Confirmar recepción","confirmReception");
	
		private String description;	
		private String actionMessage;	
		private String action;

		public String getDescription(){
			return description;
		}
		public String getActionMessage(){
			return actionMessage;
		}
		private State(String d, String am, String a){
			description = d;
			actionMessage=am;
			action = a;
		}
		public String getAction(Long id) {
			if(this.getDescription()!=State.PAYMENT_PENDING.getDescription()){
				return action +"(" +id +")";
			}
			else{
				return action + id +"'";
			}
		}
		public void setAction(String action) {
			this.action = action;
		}
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = -1513729214739166615L;
	@Id 
	public Long id;
	
	@OneToOne
	public Item item;
	public Long price;
	public Double commission;
	
	@OneToOne
	public Buyer buyer;
	
	@OneToOne
	public Stock size;
	public Integer pointsUsed =0;
	public Integer pointsEarned=0;
	public State state =State.PAYMENT_PENDING;
	public String disputeMessage;
	
	 @CreatedTimestamp
	public Timestamp create_time;
	
	 @Version
	 public Timestamp update_time;
	
	public BuyOrder(){
		
	}
	public static Finder<Long,BuyOrder> find = new Finder<Long,BuyOrder>(Long.class, BuyOrder.class);
	public BuyOrder create(BuyOrder order, Item item,Buyer buyer, String size, Integer pointsUsed) throws InvalidBuyOrderException{
		this.validateOk(item, buyer, size,pointsUsed);
		
		order.item = item;
		order.price = item.price;
		order.buyer = buyer;
		order.size = Stock.find.byId(size);
		order.pointsUsed = pointsUsed;
		order.buyer.points-=pointsUsed;
		order.commission = order.getCommision();
		
		order.buyer.save();
		order.save();
		
		return order;
	}

	
    private void validateOk(Item item, Buyer buyer, String size, Integer pointsUsed) throws InvalidBuyOrderException {
    	
    	if(notEnoughPoints(buyer, pointsUsed) 	||
    	   excededMaxPercentPermitted(item, pointsUsed) ||
    	   notSelectedSize(size)
    			){
    		throw new InvalidBuyOrderException();
    	}
    	
    	
		
	}
	private boolean notSelectedSize(String size) {
		return size.equals("null");
	}
	private boolean excededMaxPercentPermitted(Item item, Integer pointsUsed) {
		return amountPayedWithPoints(item, pointsUsed) > maxAmountPermitted(item);
	}
	private boolean notEnoughPoints(Buyer buyer, Integer pointsUsed) {
		return pointsUsed > buyer.points;
	}
	private double amountPayedWithPoints(Item item, Integer pointsUsed) {
		return pointsUsed * item.seller.pointMoneyRelation;
	}
	private double maxAmountPermitted(Item item) {
		return item.price * 0.75;
	}
    
    




	public void successfulPayment() {
		this.state = State.RECEPTION_PENDING;
		this.assignCredits();
		this.size.consumeStock();
		this.buyer.save();
		this.save();
	}
	
	private void assignCredits() {
		if(this.item.seller.pointsEnabled){
			this.pointsEarned = (int) (this.price - (this.item.seller.pointMoneyRelation *this.pointsUsed));
			this.buyer.points +=this.pointsEarned;
		}
		
	}
	public static List<BuyOrder> findBuyerOrders(Long buyerId){
		return BuyOrder.find.where()
				.eq("buyer.id", buyerId)
				.findList();
	}
	public void openDispute(String disputeMessage) {
		this.state = State.IN_DISPUTE;
		this.disputeMessage = disputeMessage;
		this.save();
	}
	public void confirmReception() {
		this.state=State.RECEPTION_CONFIRMED;
		this.save();
		
	}
	
	public static Double getSellerComissions(Long sellerId, Integer month, Integer year){
		//List<BuyOrder> orders= BuyOrder.find.select("item.id, item.title, item.collection.title, item.precio ,item.seller.pointMoneyRelation , pointsUsed")
		List<BuyOrder> orders= BuyOrder.find.where()
				.eq("item.seller.id", sellerId)
				.ne("state", State.PAYMENT_PENDING)
//				.eq("month(create_time)", month)
//				.eq("year(create_time)",year)
				.findList();
		
		Double amountToPay=0.0;
		for (BuyOrder buyOrder : orders) {
			amountToPay += buyOrder.commission;
		}
		return amountToPay;
	}


	private double getCommision() {
		return (price - (pointsUsed* item.seller.pointMoneyRelation)) * COMMISSION_PERCENT;
	}

}
