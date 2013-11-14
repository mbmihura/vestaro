package controllers;

import play.mvc.Result;

public class NotificationController extends BaseController {
	public static Result getNotifications() {

		return ok(views.html.notifications.render());
	}
}
