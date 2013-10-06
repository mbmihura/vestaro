package controllers;

import play.Routes;
import play.mvc.Result;
import views.html.aboutPlay;
import views.html.index;
import security.RestrictTo;
import security.Roles;
import models.Rol;
import models.User; 

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
    			// buyyer
    		}
    	}
        return ok(index.render());
    }

    @RestrictTo(Roles.SELLER)
    public static Result aboutPlay() {
        return ok(aboutPlay.render("Your new application is ready."));
    }
    
    public static Result facebookPlugins(){
    	return ok(views.html.facebookPlugins.render());
    }
    
    // -- Javascript routing
    public static Result javascriptRoutes() {
        response().setContentType("text/javascript");
        return ok(
            Routes.javascriptRouter("jsRoutes",
            
                // Routes for Collections
                //controllers.routes.javascript.Collections.add(), 
                
                // Routes for Items
            	controllers.routes.javascript.Items.form(),
                controllers.routes.javascript.Items.submit(), 
                controllers.routes.javascript.Items.read(),
                controllers.routes.javascript.Items.update(),
                controllers.routes.javascript.Items.delete(),
                
                // Routes for Sellers
                controllers.routes.javascript.Sellers.itemsOwnedBy()
                
            )
        );
    }
}
