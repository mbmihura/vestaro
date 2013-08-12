package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.aboutPlay;
import views.html.index;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render());
    }
    
    public static Result recoExample() {
        return ok(views.html.recoExample.render());
    }
    
    public static Result aboutPlay() {
        return ok(aboutPlay.render("Your new application is ready."));
    }
  
}
