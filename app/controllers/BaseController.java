package controllers;

import play.mvc.Controller;
import models.User;

public class BaseController extends Controller {
    public static Long currentUserId() {
    	return Authentication.currentUserId();
    }

    public static User currentUser() {
        return Authentication.currentUser();
    }
}
