package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboards.*;

public class Dashboards extends Controller {
  
    public static Result index() {
        return ok(customer.render());
    }

    
  
}
