package controllers;

import java.util.ArrayList;

import models.BuyOrder;
import models.BuyOrder.State;
import models.Buyer;
import models.Item;
import play.mvc.Result;

public class BuyerController extends BaseController {
  
    public static Result profile(){
    	
    	return ok(views.html.buyerProfile.render(getMockOrders(), Buyer.findBuyerByUser( currentUserId())));
    }
	

	private static ArrayList<BuyOrder> getMockOrders() {
		ArrayList<BuyOrder> orders = new ArrayList<BuyOrder>();
		
    	Item item1= Item.find.byId("CG1");
    	Item item2= Item.find.byId("CB1");
    	orders.add(new BuyOrder((long) 1,item1, new models.Buyer(), "L", 55, State.PAYMENT_PENDING));
    	orders.add(new BuyOrder((long) 2,item2, new models.Buyer(), "M", 50, State.RECEPTION_PENDING));
    	orders.add(new BuyOrder((long) 3,item1, new models.Buyer(), "S", 55, State.RECEPTION_CONFIRMED));
    	orders.add(new BuyOrder((long) 4,item1, new models.Buyer(), "S", 50, State.IN_DISPUTE));
		return orders;
	}
    
}

