package controllers;

import models.Item;
import models.WishlistItem;
import play.libs.Json;
import play.mvc.Result;

public class WishlistController extends BaseController {
	
	public Result userWishlistItems() {
		return ok(Json.toJson(WishlistItem.findItemsOwnedBy(currentUserId())));
	}
	
	public Result addItemToWishlist(String itemId) {
		try {
			WishlistItem wish = new WishlistItem(Item.find.byId(itemId), currentUser());
			wish.save();
			return ok();
		} catch (Exception e) {
			play.Logger.error(e.getMessage());
			return badRequest();
		}
	}

}
