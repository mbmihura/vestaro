package models;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Notification extends Model {

	public enum NotificationType {
		SALE("Nueva Venta", " compró el item "), DISPUTE("Venta en Disputa", " abrió una disputa por el item ");

		private String message;
		private String action;

		public String getMessage() {
			return message;
		}

		private NotificationType(String msg, String action) {
			this.message = msg;
			this.action = action;
		}

		public String getAction() {
			return action;
		}

	}

	@Id
	public Long id;

	@OneToOne
	public NotificationType notificationType;
	public boolean seen;
	public String buyerName;
	public String itemTitle;
	public Long sellerId;
	public Long buyerFBId;
	public Integer pointsUsed;
	public double ammountPayed;
	public String disputeMessage;

	public Date create_time;

	private Long buyOrderId;

	public static Finder<Long, Notification> find = new Finder<Long, Notification>(Long.class, Notification.class);

	public Notification() {

	}

	public Notification(BuyOrder order, NotificationType type) {
		this.notificationType = type;
		this.seen = false;
		this.buyerName = order.buyer.user.name;
		this.itemTitle = order.item.title;
		this.sellerId = order.item.seller.id;
		this.buyerFBId = order.buyer.user.userId;
		this.disputeMessage = order.disputeMessage;
		this.pointsUsed = order.pointsUsed;
		this.ammountPayed = order.price - order.pointsEarned;
		this.buyOrderId = order.id;

	}

	public void createNotification(BuyOrder order, NotificationType type) {
		Notification newNotification = new Notification(order, type);
		newNotification.create_time = new Date();
		newNotification.save();

	}

	public void notifyDispute(BuyOrder order) {
		createNotification(order, NotificationType.DISPUTE);
	}

	public void notifySale(BuyOrder order) {
		createNotification(order, NotificationType.SALE);
	}

	public static Map<String, List<Notification>> getNotifications(Long sellerId) {
		List<Notification> notificationList = Notification.find.where().eq("sellerId", sellerId)
				.orderBy("create_time DESC").findList();

		Map<String, List<Notification>> groupByNotifications = groupByNotifications(notificationList);
		return groupByNotifications;

	}

	private static Map<String, List<Notification>> groupByNotifications(List<Notification> notificationList) {

		Map<String, List<Notification>> groupByNotifications = new LinkedHashMap<String, List<Notification>>();
		if (notificationList.size() == 0) {
			return groupByNotifications;
		}

		String stringDate = stringFormatDate(notificationList.get(0).create_time);
		ArrayList<Notification> notifications = new ArrayList<>();

		for (Notification notification : notificationList) {
			if (stringFormatDate(notification.create_time).equalsIgnoreCase(stringDate)) {
				notifications.add(notification);
			} else {
				groupByNotifications.put(stringDate, notifications);

				stringDate = stringFormatDate(notification.create_time);
				notifications = new ArrayList<Notification>();
			}
		}
		groupByNotifications.put(stringDate, notifications);

		return groupByNotifications;
	}

	private static String stringFormatDate(Date date) {
		String month = new SimpleDateFormat("MMM").format(date);
		String day = new SimpleDateFormat("dd").format(date);
		String stringDate = day + " de " + month;
		return stringDate;
	}

	public void markAsSeen() {
		this.seen = true;
		this.save();

	}

	public String modalMessage() {
		String message;
		if (this.notificationType == NotificationType.DISPUTE) {
			message = this.buyerName + " abrió una disputa en la órden de compra con id #" + this.buyOrderId
					+ " correspondiente al item \"" + this.itemTitle + "\".";
			if (this.disputeMessage.length() > 0) {
				message += " El comprador dejó el siguiente mensaje: \"" + this.disputeMessage + "\".";
			}
			message += " Por favor comunicate con " + this.buyerName + ".";
		} else {
			message = this.buyerName + " compró tu item \"" + this.itemTitle + "\"."
					+ " La órden de compra correspondiente es la número #:  " + this.buyOrderId + ".";
			message += " El comprador pagó $" + this.ammountPayed + " por la prenda. ";
			if (this.pointsUsed > 0) {
				message += "El resto (" + this.pointsUsed + ") fue pagado con puntos. ";
			}

			message += "Recordá que el 4% del monto recibido por esta venta deberá ser pagado en concepto de comisión a Vestaro desde "
					+ "tu Dashboard. ";
		}

		return message;
	}
}
