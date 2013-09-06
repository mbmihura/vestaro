package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.aboutPlay;
import views.html.index;
import security.RestrictTo;
import security.Roles;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render());
    }

    @RestrictTo(Roles.buyer)
    public static Result aboutPlay() {
        return ok(aboutPlay.render("Your new application is ready."));
    }
  
}
