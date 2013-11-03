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
	public static Result Update()
	{
		User currentUser = currentUser();
		
		DynamicForm data = Form.form().bindFromRequest();
        String name = data.get("name");
        
        if (name != null && !name.isEmpty())
        	currentUser.name = name;

        currentUser.save();
        return ok(Json.toJson(currentUser));
	}
}
