package controllers;

import play.Play;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Http.Context;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import models.User;
import utils.Crypto;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.io.UnsupportedEncodingException;



public class Authentication extends Controller {
  
	private static final String currentUserIdKey = "currentUserId";
	private static final String appSecretFbKey = Play.application().configuration().getString("fb.appSecretKey");
	
    public static Result login() {
    	DynamicForm data = Form.form().bindFromRequest();
        String signedRequest = data.get("signedRequest");
        
        //Form<FbAuthResponse> fbAuthResponseForm = Form.form(FbAuthResponse.class);
        //FbAuthResponse fbAuth = fbAuthResponseForm.bindFromRequest().get();

        //String signedRequest = fbAuth.signedRequest;

        if (signedRequest != null && !signedRequest.isEmpty())
        { 
            String[] signedRequests = signedRequest.split("\\.", 2);
            String urlBase64EncodedSignature = signedRequests[0];
            String payload = signedRequests[1];

            String signature = Crypto.getBase64UrlDecode(urlBase64EncodedSignature);
            String expectedSignature = Crypto.getHashHmacSHA256(payload,appSecretFbKey);

            //Verified that computed signature and recieved one matches.
            if(expectedSignature.equals(signature)) {
                String signedData = Crypto.getBase64UrlDecode(payload);

                // Retrieve userId and create a session for it.
                String userId = Json.parse(signedData).get("user_id").getTextValue();
                session().clear();
                session(currentUserIdKey, userId);
            
                return ok(Json.parse(signedData));
            } else {
                return forbidden();
            }
        } else
        {
            return badRequest("SignedRequest is requiered and its value was " + signedRequest);
        }
	}

    public static Result logout() {
        session().clear();
        return redirect(
            routes.Application.index()
        );
    }
    
    public static Long currentUserId() {
        String userId = session(currentUserIdKey);
        return userId != null? Long.parseLong(userId) : null;
   }
    
    public static User currentUser() {
        return User.authenticate(Authentication.currentUserId());
    }
}