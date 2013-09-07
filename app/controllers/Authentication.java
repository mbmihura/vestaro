package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Http.Context;
import play.data.Form;
import play.libs.Json;
import models.FbAuthResponse;
import models.User;
import utils.Crypto;
import views.html.index;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.io.UnsupportedEncodingException;



public class Authentication extends Controller {
  
	private final String currentUserIdKey = "currentUserId";
	
    public static Result login() {
        Form<FbAuthResponse> fbAuthResponseForm = Form.form(FbAuthResponse.class);
        FbAuthResponse fbAuth = fbAuthResponseForm.bindFromRequest().get();

        String signedRequest = fbAuth.signedRequest;

        if (signedRequest != null && !signedRequest.isEmpty())
        { 
            String[] signedRequests = signedRequest.split("\\.", 2);
            String urlBase64EncodedSignature = signedRequests[0];
            String payload = signedRequests[1];

            String signature = Crypto.getBase64UrlDecode(urlBase64EncodedSignature);
            String expectedSignature = Crypto.getHashHmacSHA256(payload,"4f544dfc621106bd86c30f2ce14d2575");

            //Verified that computed signature and recieved one matches.
            if(expectedSignature.equals(signature)) {
                String signedData = Crypto.getBase64UrlDecode(payload);

                // Retrieve userId and create a session for it.
                String userId = Json.parse(signedData).get("user_id").toString();
                session().clear();
                session("userId", userId);
            
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
        String userId = session("userId");;
        return userId != null? Long.parseLong(userId) : null;
   }
    
    public static User currentUser() {
        return User.authenticate(Authentication.currentUserId());
    }
}