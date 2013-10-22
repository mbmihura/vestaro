package controllers;

import models.Item;
import models.WishlistItem;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.RestrictTo;
import security.Roles;

public class WishlistController extends BaseController {
	
	@RestrictTo(Roles.BUYER)
	public static Result userWishlistItems() {
		return ok(Json.toJson(WishlistItem.findItemsOwnedBy(currentUserId())));
	}
	
	@RestrictTo(Roles.BUYER)
	public static Result addItemToWishlist() {
		try {
			DynamicForm data = Form.form().bindFromRequest();
			String itemId = data.get("itemId");
			// Checks if item is already in wishlist.
			WishlistItem wishItem = WishlistItem.find.where()
					.eq("owner.userId", currentUserId())
					.eq("item.id", itemId).findUnique();
			// Cannot have duplicates.
			if(wishItem != null) return badRequest();
			
			WishlistItem wish = new WishlistItem(Item.find.byId(itemId), currentUser());
			wish.save();
			return ok(itemId + " added to wishlist.");
		} catch (Exception e) {
			play.Logger.error(e.getMessage());
			return badRequest(e.getMessage());
		}
	}
	
	@RestrictTo(Roles.BUYER)
	public static Result removeItemFromWishlist(String itemId) {
		try {	
			WishlistItem wish = WishlistItem.find.where()
					.eq("owner.userId", currentUserId())
					.eq("item.id", itemId).findUnique();
			wish.delete();
			return ok(itemId + " removed from wishlist.");
		} catch (Exception e) {
			play.Logger.error(e.getMessage());
			return badRequest(e.getMessage());
		}
	}
}