package models;

import java.util.ArrayList;

import mercadopago.MP;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
public class PaymentManager {

	private static final String SITE_URL = "http://localhost:9000";
	private static final String PAYMENT_SUCCESS_URL = SITE_URL + "/#/payment/success/";
	private static final String PAYMENT_ERROR_URL = SITE_URL + "/#/payment/error/";
	private static final String PAYMENT_PENDING_URL = SITE_URL + "/#/payment/success/";
	private static final String COMMISSION_PAYMENT_SUCCESS_URL = SITE_URL + "/#/commissionPayment/success/";
	private static final String COMMISSION_PAYMENT_ERROR_URL = SITE_URL + "/#/commissionPayment/error/";
	private static final String COMMISSION_PAYMENT_PENDING_URL = SITE_URL + "/#/commissionPayment/success/";
	
	private static final String CLIENT_SECRET_VESTARO = "uToiGVlNavrrbtjFX6ksHP51RQsG5and";
	private static final String CLIENT_ID_VESTARO = "1406963671517811";
	
	
	public String checkout(BuyOrder buyOrder) throws JSONException, Exception {
		 MP mp = new MP(buyOrder.item.seller.mp_client_id, buyOrder.item.seller.mp_client_secret);
				 
		 JSONObject buyPreferenceJson= mp.createPreference(createJSONPreference(buyOrder));
		 		
		 return buyPreferenceJson.getJSONObject("response").getString("sandbox_init_point");
	}
	
	public String commissionCheckoutUrl(Double value) throws JSONException, Exception{
		 MP mp = new MP(CLIENT_ID_VESTARO, CLIENT_SECRET_VESTARO);
		 JSONObject commissionPreferenceJson= mp.createPreference(createCommissionJSONPreference(value));

		 return commissionPreferenceJson.getJSONObject("response").getString("sandbox_init_point");
	}


	private JSONObject createCommissionJSONPreference(Double value) throws JSONException {
		
		JSONObject preferenceJson = new JSONObject();
		 
		 JSONObject itemJson = new JSONObject();
		 itemJson.put("title","Pago Comisión");
		 itemJson.put("quantity", 1);
		 itemJson.put("unit_price", value);
		 itemJson.put("currency_id", "ARS");
		 
		 ArrayList<JSONObject> items = new ArrayList<JSONObject>();
		 items.add(itemJson);
		 
		 
		 JSONObject backUrlJson = new JSONObject();
		 backUrlJson.put("success", COMMISSION_PAYMENT_SUCCESS_URL );
		 backUrlJson.put("error", COMMISSION_PAYMENT_ERROR_URL);
		 backUrlJson.put("pending", COMMISSION_PAYMENT_PENDING_URL);
		 
		 
		 JSONObject excludedPaymentMethodJSON = excudedTypesPreferences();
		 
		 preferenceJson.put("items", items);
		 preferenceJson.put("back_urls", backUrlJson);
		 preferenceJson.put("payment_methods", excludedPaymentMethodJSON);
		 
		return preferenceJson;

	}

	private JSONObject excudedTypesPreferences() throws JSONException {
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
		return excludedPaymentMethodJSON;
	}

	private JSONObject createJSONPreference(BuyOrder buyOrder) throws JSONException {
		double payamount= buyOrder.price - (buyOrder.pointsUsed * buyOrder.item.seller.pointMoneyRelation);
		
		JSONObject preferenceJson = new JSONObject();
		 
		 JSONObject itemJson = new JSONObject();
		 itemJson.put("id", buyOrder.item.id);
		 itemJson.put("title", buyOrder.item.title);
		 itemJson.put("description", buyOrder.item.description);
		 itemJson.put("quantity", 1);
		 itemJson.put("unit_price", payamount);
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
		 
		 JSONObject excludedPaymentMethodJSON = excudedTypesPreferences();
		 
		 preferenceJson.put("items", items);
		 preferenceJson.put("back_urls", backUrlJson);
		 preferenceJson.put("external_reference", buyOrder.id);
		 preferenceJson.put("payer", payerJSON);
		 preferenceJson.put("payment_methods", excludedPaymentMethodJSON);
		 
		return preferenceJson;
	}
}
