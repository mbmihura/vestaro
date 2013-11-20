package controllers;

import java.util.List;
import java.util.Map;

import models.Notification;
import models.Seller;
import play.mvc.Result;

import security.RestrictTo;
import security.Roles;

@RestrictTo(Roles.SELLER)
public class NotificationController extends BaseController {
	public static Result getNotifications() {
		Map<String, List<Notification>> notifications = Notification
				.getNotifications(Seller.findSellerByUser(currentUserId()).id);
		return ok(views.html.notifications.render(notifications));
	}

	public static Result markAsSeen(Long id) {
		Notification.find.byId(id).markAsSeen();
		return ok();
	}
}
