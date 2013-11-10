package controllers;

import models.Buyer;
import models.Seller;
import models.User;

import org.codehaus.jackson.JsonNode;

import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.RestrictTo;
import security.Roles;
import security.SubjectPresent;


public class UserController extends BaseController {
	
	@SubjectPresent
	public static Result updateCurrent(){
		DynamicForm data = Form.form().bindFromRequest();
    	User user = currentUser();
    	
        String name = data.get("name");
        if (name != null)
        	user.name = name;
    	
        user.save();
        return ok(Json.toJson(user));
    }


    @SubjectPresent
    public static Result readCurrentId() {
        return ok(Json.toJson(currentUserId()));
    }
  
    @SubjectPresent
    public static Result readCurrent() {
        return ok(Json.toJson(currentUser()));
    }
    
    @RestrictTo(Roles.ADMIN)
    public static Result readAll() {
        return ok(Json.toJson(User.find.all()));
    }
    
    @RestrictTo(Roles.ADMIN)
    public static Result delete(Long id) {
    	// TODO validate that current user is not been delete.
    	User user = User.findById(id);
    	JsonNode userJson = Json.toJson(user);
    	if (user == null) 
    		return notFound();
    	else {
    		user.deleteManyToManyAssociations("roles");
	    	Seller seller = Seller.findSellerByUser(id);
	    	if (seller != null) seller.delete();
	    	Buyer buyer = Buyer.findBuyerByUser(id);
	    	if (buyer != null) buyer.delete();
	    	
	    	user.delete();
	        return ok(userJson);
    	}
    }
}
