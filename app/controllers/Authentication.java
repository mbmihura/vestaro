package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import play.data.Form;
import play.libs.Json;
import models.FbAuthResponse;

public class Authentication extends Controller {
  
    public static Result login() {
    	Form<FbAuthResponse> fbAuthResponseForm = Form.form(FbAuthResponse.class);
    	FbAuthResponse fbAuth = fbAuthResponseForm.bindFromRequest().get();
        return ok(Json.toJson(fbAuth));
    }  
}
