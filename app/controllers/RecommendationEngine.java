package controllers;

import play.mvc.Controller;
import play.mvc.Result;

public class RecommendationEngine extends Controller{
	 
	public static Result recoExample() {
	        return ok(views.html.recoExample.render());
	 }
}
