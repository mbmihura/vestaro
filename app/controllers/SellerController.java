package controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import org.codehaus.jettison.json.JSONException;

import models.BuyOrder;
import models.Collection;
import models.CollectionItems;
import models.Item;
import models.PaymentManager;
import models.Seller;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import security.SubjectPresent;

public class SellerController extends BaseController {
    
	public static Result itemsOwnedBy(Long sellerId){
		List<Item> items = Item.findItemsOwnedBy(sellerId);
		return ok(Json.toJson(items));
	}
    
    public static Result listCollections(Long sellerId) {
    	List<Collection> collections = Collection.findCollectionsOwnedBy(sellerId);
    	List<CollectionItems> items = new ArrayList<CollectionItems>();
    	
		for(Collection collection : collections){
			items.add(new CollectionItems(collection));
		}
    	
    	return ok(Json.toJson(items));
    }
    
    public static Result findSellerById(Long sellerId) {
    	return ok(Json.toJson(Seller.find.byId(sellerId)));
    }
        
    @SubjectPresent
	public static Result readCurrent(){
        return ok(Json.toJson(Seller.findSellerByUser(currentUserId()))); 
    }
    @SubjectPresent
    public static Result createOrUpdateCurrent() {
    	Long currentUserId = currentUserId();
    	Seller currentSeller = Seller.findSellerByUser(currentUserId());
    	
    	if (currentSeller == null)
    		currentSeller = Seller.createFor(currentUserId);
    	
		DynamicForm data = Form.form().bindFromRequest();
        
		String brandName = data.get("brandName");
		if (brandName != null && !brandName.isEmpty())
			currentSeller.brandName = brandName;

		String logoUrl = data.get("logoUrl");
		if (logoUrl != null && !logoUrl.isEmpty())
			currentSeller.logoUrl = logoUrl;
		
		String webpageUrl = data.get("webpageUrl");
		if (webpageUrl != null && !webpageUrl.isEmpty())
			currentSeller.webpageUrl = webpageUrl;
		
		String pointsEnabled = data.get("pointsEnabled");
		if (pointsEnabled != null && !pointsEnabled.isEmpty())
			currentSeller.pointsEnabled = Boolean.parseBoolean(pointsEnabled);
		
		String pointMoneyRelation = data.get("pointMoneyRelation");
		if (pointMoneyRelation != null && !pointMoneyRelation.isEmpty())
			currentSeller.pointMoneyRelation = Double.parseDouble(pointMoneyRelation);
		
		String mp_client_secret = data.get("mp_client_secret");
		if (mp_client_secret != null && !mp_client_secret.isEmpty())
			currentSeller.mp_client_secret = mp_client_secret;
		
		String mp_client_id = data.get("mp_client_id");      
		if (mp_client_id != null && !mp_client_id.isEmpty())
			currentSeller.mp_client_id = mp_client_id;

		currentSeller.save();
        return ok(Json.toJson(currentSeller));
    }
    
    public static Result sellerCommission() {
    	
    	HashMap<String, Object> responseMap = new LinkedHashMap<String, Object>();
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	Double commissionValue= BuyOrder.getSellerComissions(seller.id) ;
    	responseMap.put("commissionValue", commissionValue);
    	
    	if(commissionValue >0){
    		PaymentManager manager = new PaymentManager();
    		try {
    			String commissionCheckOutUrl= manager.commissionCheckoutUrl(commissionValue);
    			responseMap.put("commissionCheckoutUrl", commissionCheckOutUrl);
    			
    		} catch (JSONException e) {
    			play.Logger.error(e.getMessage());
    			return badRequest();
    		}catch (Exception e) {
    			play.Logger.error(e.getMessage());
    			return badRequest();

    		}
    		
    	}
    	
    	return ok(Json.toJson(responseMap));
    }

    public static Result commissionDetail(){
    	Seller seller = Seller.findSellerByUser(currentUserId());
    	return ok(Json.toJson(BuyOrder.getCommissionsDetail(seller.id)) );
    }
}

