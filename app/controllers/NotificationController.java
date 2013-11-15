package controllers;

import java.util.List;
import java.util.Map;

import models.Notification;
import models.Seller;
import play.mvc.Result;

public class NotificationController extends BaseController {
	public static Result getNotifications() {
		Map<String, List<Notification>> notifications = Notification
				.getNotifications(Seller.findSellerByUser(currentUserId()).id);
		return ok(views.html.notifications.render(notifications));
	}
}
