package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboards.*;
import views.html.shared.*;

public class Dashboards extends Controller {
  
    public static Result index() {
        return ok(customer.render());
    }

    
  
}
