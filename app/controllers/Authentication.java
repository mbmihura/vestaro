package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.aboutPlay;
import views.html.index;

public class Authentication extends Controller {
  
    public static Result login() {

    	if (true) //TODO: Fadebook validation & token
    	{
    		String userId = Long.toString(0); //TODO: retireve userId form header or fb response.
			session().clear();
        	session("userId", userId);
        	return ok(userId);
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
