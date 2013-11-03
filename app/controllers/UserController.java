package controllers;

import play.Play;
import play.mvc.Controller;
import play.mvc.Result;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import models.User;
import security.SubjectPresent;
import utils.Crypto;


public class UserController extends BaseController {
	
	@SubjectPresent
	public static Result update(){
		DynamicForm data = Form.form().bindFromRequest();
    	User user = currentUser();
    	
        String name = data.get("name");
        if (name != null)
        	user.name = name;
    	
        user.save();
        return ok(Json.toJson(user));
    }


    @SubjectPresent
    public static Result getUserId() {
        return ok(Json.toJson(currentUserId()));
    }
    
    @SubjectPresent
    public static Result getUser() {
        return ok(Json.toJson(currentUser()));
    }
}
