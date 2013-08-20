package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.aboutPlay;
import views.html.detail;
import views.html.shared.*;

public class Application extends Controller {
  
    public static Result index() {
        return ok(itemList.render());
    }

    public static Result detail() {
        return ok(detail.render());
    }

    public static Result list() {
        return ok(itemListVertical.render());
    }

    public static Result aboutPlay() {
        return ok(aboutPlay.render("Your new application is ready."));
    }
  
}
