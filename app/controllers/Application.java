package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.aboutPlay;
import views.html.index;
import views.html.detail;
import views.html.list;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render());
    }

    public static Result detail() {
        return ok(detail.render());
    }

    public static Result list() {
        return ok(list.render());
    }

    public static Result aboutPlay() {
        return ok(aboutPlay.render("Your new application is ready."));
    }
  
}
