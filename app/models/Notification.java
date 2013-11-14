package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Notification extends Model {

	public enum NOTIFICATION_TYPE {
		SALE, DISPUTE
	}

	@Id
	public Long id;

	@OneToOne
	public BuyOrder buyOrder;
	public NOTIFICATION_TYPE type;
	public boolean seen;

	public Notification() {

	}

	public Notification(BuyOrder order, NOTIFICATION_TYPE type) {
		this.type = type;
		this.buyOrder = order;
		this.seen = false;

	}

	public void createNotification(BuyOrder order, NOTIFICATION_TYPE type) {
		Notification newNotification = new Notification(order, type);
		newNotification.save();

	}

	public void notifyDispute(BuyOrder order) {
		createNotification(order, NOTIFICATION_TYPE.DISPUTE);
	}

	public void notifySale(BuyOrder order) {
		createNotification(order, NOTIFICATION_TYPE.SALE);
	}
}
