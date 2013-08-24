package controllers;

import play.Routes;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.dashboard.*;;

public class Dashboard extends Controller {
  
    public static Result dashboardTest() {
        return ok(dashboardTest.render());
    }

}
