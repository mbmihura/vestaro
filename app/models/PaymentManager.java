package models;

import java.util.ArrayList;

import mercadopago.MP;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
public class PaymentManager {

	private static final String SITE_URL = "http://localhost:9000";
	private static final String PAYMENT_SUCCESS_URL = SITE_URL + "/payment/success/";
	private static final String PAYMENT_ERROR_URL = SITE_URL + "/payment/error/";
	private static final String PAYMENT_PENDING_URL = SITE_URL + "/payment/pending/";

	
	private static final String CLIENT_SECRET_VESTARO = "uToiGVlNavrrbtjFX6ksHP51RQsG5and";
	private static final String CLIENT_ID_VESTARO = "1406963671517811";
	
	
	public String checkout(BuyOrder buyOrder) throws JSONException, Exception {
		 MP mp = new MP(buyOrder.item.seller.mp_client_id, buyOrder.item.seller.mp_client_secret);
				 
		 JSONObject buyPreferenceJson= mp.createPreference(createJSONPreference(buyOrder));
		 		
		 return buyPreferenceJson.getJSONObject("response").getString("sandbox_init_point");
	}


	private JSONObject createJSONPreference(BuyOrder buyOrder) throws JSONException {
		JSONObject preferenceJson = new JSONObject();
		 
		 JSONObject itemJson = new JSONObject();
		 itemJson.put("id", buyOrder.item.id);
		 itemJson.put("title", buyOrder.item.title);
		 itemJson.put("description", buyOrder.item.description);
		 itemJson.put("quantity", 1);
		 itemJson.put("unit_price", buyOrder.price);
		 itemJson.put("currency_id", "ARS");
		 itemJson.put("picture_url", buyOrder.item.imgUrl);
		 
		 ArrayList<JSONObject> items = new ArrayList<JSONObject>();
		 items.add(itemJson);
		 
		 
		 JSONObject backUrlJson = new JSONObject();
		 backUrlJson.put("success", PAYMENT_SUCCESS_URL + buyOrder.id);
		 backUrlJson.put("error", PAYMENT_ERROR_URL + buyOrder.id);
		 backUrlJson.put("pending", PAYMENT_PENDING_URL + buyOrder.id);
		 
		 JSONObject payerJSON = new JSONObject();
		 payerJSON.put("email", buyOrder.buyer.mail);
		 
		 JSONObject excludedPaymentMethodJSON = new JSONObject();
		
		 ArrayList<JSONObject> excludedTypes = new ArrayList<JSONObject>();
		 JSONObject typeTicket = new JSONObject();
		 typeTicket.put("id", "ticket");
		 JSONObject typeTransfer = new JSONObject();
		 typeTransfer.put("id", "Bank Transfer");
		 JSONObject typeATM= new JSONObject();
		 typeATM.put("id", "atm");
		 excludedTypes.add(typeTicket);
		 excludedTypes.add(typeTransfer);
		 excludedTypes.add(typeATM);
		 excludedPaymentMethodJSON.put("excluded_payment_types", excludedTypes);
		 
		 preferenceJson.put("items", items);
		 preferenceJson.put("back_urls", backUrlJson);
		 preferenceJson.put("external_reference", buyOrder.id);
		 preferenceJson.put("payer", payerJSON);
		 preferenceJson.put("payment_methods", excludedPaymentMethodJSON);
		 
		return preferenceJson;
	}
}
