package controllers;

import models.BuyOrder;
import play.mvc.Controller;
import play.mvc.Result;

public class Payment extends Controller{

	public static Result success(Long orderId){
		BuyOrder buyOrder= BuyOrder.find.byId(orderId);
		buyOrder.successfulPayment();
		return ok(views.html.successfulPayment.render(buyOrder, (buyOrder.pointsEarned >0)));

		
	}
	public static Result error(Long orderId){
		return ok(views.html.failedPayment.render());		
	}
	public static Result pending(Long orderId){
		return TODO;
		
	}
}

