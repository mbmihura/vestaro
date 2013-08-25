package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import play.data.Form;
import play.libs.Json;
import models.FbAuthResponse;
import views.html.index;

public class Authentication extends Controller {
  
    public static Result login() {
        Form<FbAuthResponse> fbAuthResponseForm = Form.form(FbAuthResponse.class);
        FbAuthResponse fbAuth = fbAuthResponseForm.bindFromRequest().get();

    	if (true) //TODO: Fadebook validation & token
    	{
			session().clear();
        	session("userId", fbAuth.userID);
        	return ok(Json.toJson(fbAuth));
    	} else {
    		return badRequest("Invalid user");
    	}
    }  

    public static Result logout() {
	    session().clear();
	    return redirect(
	        routes.Application.index()
	    );
	}
}
