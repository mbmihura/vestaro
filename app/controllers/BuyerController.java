package controllers;

import java.util.HashMap;
import java.util.LinkedHashMap;

import models.BuyOrder;
import models.Buyer;
import models.Notification;
import models.PaymentManager;

import org.codehaus.jettison.json.JSONException;

import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.RestrictTo;
import security.Roles;

@RestrictTo(Roles.BUYER)
public class BuyerController extends BaseController {

	private static final int UNPROCESSABLE_ENTITY = 422;

	public static Result profile() {

		Buyer buyer = Buyer.findBuyerByUser(currentUserId());
		return ok(views.html.buyerProfile.render(BuyOrder.findBuyerOrders(buyer.id), buyer));
	}

	public static Result openDispute(Long orderId, String disputeMessage) {

		BuyOrder order = BuyOrder.find.byId(orderId);
		order.openDispute(disputeMessage);

		Notification notificationManager = new Notification();
		notificationManager.notifyDispute(order);
		return ok();
	}

	public static Result confirmReception(Long orderId) {
		BuyOrder.find.byId(orderId).confirmReception();
		return ok();
	}

	public static Result payOrder() {
		String orderId = Form.form().bindFromRequest().get("id");
		PaymentManager manager = new PaymentManager();
		BuyOrder buyOrder = BuyOrder.find.byId(Long.parseLong(orderId));

		try {
			return ok(views.html.payOrder.render(buyOrder.item, buyOrder.size.size, buyOrder.pointsUsed,
					manager.checkout(buyOrder), false));
		} catch (JSONException e) {
			return badRequest();// TODO: think what to do when it fails
		} catch (Exception e) {
			return badRequest();// TODO: think what to do when it fails
		}
	}

	public static Result readCurrent() {
		return ok(Json.toJson(Buyer.findBuyerByUser(currentUserId())));
	}

	public static Result createOrUpdateCurrent() {
		// TODO: check if buyer was already created to avoid losing points if
		// method is call twice [low priority]
		Buyer buyer = Buyer.createFor(currentUserId());
		buyer.save();
		return ok(Json.toJson(buyer));
	}

	public static Result modifyOrder(Long orderId, String selectedSizeId, Integer pointsToUse) {
		try {

			BuyOrder order = BuyOrder.findBuyerOrder(orderId, Buyer.findBuyerByUser(currentUserId()).id);
			if (order == null) {
				return badRequest();
				// Trying to modify another user order
			}
			
			Long sizeId;
			try {
				sizeId = Long.parseLong(selectedSizeId);
			} catch (NumberFormatException ex)
			{
				return badRequest();
			}
			order.modify(sizeId, pointsToUse);
			PaymentManager manager = new PaymentManager();
			HashMap<String, Object> jsonResult = new LinkedHashMap<String, Object>();
			jsonResult.put("checkoutUrl", manager.checkout(order));
			jsonResult.put("buyOrderId", order.id);

			return ok(Json.toJson(jsonResult));

		} catch (JSONException e) {
			play.Logger.error(e.getMessage());
			return badRequest();
		} catch (Exception e) {
			play.Logger.error(e.getMessage());
			return status(UNPROCESSABLE_ENTITY);
		}

	}
}
