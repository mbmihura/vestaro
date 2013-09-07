package controllers;

import play.mvc.Controller;
import models.User;

public class BaseController extends Controller {
    public Long currentUserId() {
    	return Authentication.currentUserId();
    }

    public User currentUser() {
        return User.authenticate(Authentication.currentUserId());
    }
  
  	

}
