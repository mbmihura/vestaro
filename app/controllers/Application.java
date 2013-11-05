package controllers;

import models.Rol;
import models.User;
import play.Routes;
import play.mvc.Result;
import security.RestrictTo;
import security.Roles;
import views.html.aboutPlay;
import views.html.index;

public class Application extends BaseController {
	
    public static Result index() {
    	User user = currentUser();
    	if (user == null)
    	{
    		// No user logged
    	}else
    	{
    		// Solve Ebean issue and implement a singleton such as Rol.SELLER, and avoid going every time to de db.
    		if (user.getRoles().contains(Rol.findByName(Roles.SELLER)))
    		{
    			// Seller
    			
    		}else
    		{
    			// buyer
    		}
    	}
        return ok(index.render());
    }

    @RestrictTo(Roles.SELLER)
    public static Result aboutPlay() {
        return ok(aboutPlay.render("Your new application is ready."));
    }
    
    // -- Javascript routing
    public static Result javascriptRoutes() {
        response().setContentType("text/javascript");
        return ok(
            Routes.javascriptRouter("jsRoutes",

                // Routes for Collections
                controllers.routes.javascript.CollectionController.form(),
                controllers.routes.javascript.CollectionController.submit(),
                controllers.routes.javascript.CollectionController.update(),
                controllers.routes.javascript.CollectionController.delete(),
                controllers.routes.javascript.CollectionController.getItemsFromCollection(),
                controllers.routes.javascript.CollectionController.getItemsWithNoCollection(),
                controllers.routes.javascript.CollectionController.deleteCollectionId(),
                
                // Routes for Items
            	controllers.routes.javascript.ItemController.form(),
                controllers.routes.javascript.ItemController.submit(), 
                controllers.routes.javascript.ItemController.read(),
                controllers.routes.javascript.ItemController.createOrUpdate(),
                controllers.routes.javascript.ItemController.delete(),
                controllers.routes.javascript.ItemController.orderItem(),
                
                // Routes for Sellers
                controllers.routes.javascript.SellerController.itemsOwnedBy(),
                controllers.routes.javascript.SellerController.listCollections(),
                controllers.routes.javascript.SellerController.findSellerById(),
                controllers.routes.javascript.SellerController.createOrUpdateCurrent(), 
                controllers.routes.javascript.SellerController.readCurrent(), 
                // Routes for Dashboard
                controllers.routes.javascript.DashboardController.biggestCollections(),
                controllers.routes.javascript.DashboardController.littleItemsStock(),
                controllers.routes.javascript.DashboardController.itemsViewedFromCollections(),

                // Routes for Actions
                controllers.routes.javascript.ActionController.actionsFrom(),
                
                //Routes for Buyers
                controllers.routes.javascript.BuyerController.openDispute(),
                controllers.routes.javascript.BuyerController.confirmReception()
            )
        );
    }
}
