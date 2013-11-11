package controllers;

import models.Buyer;
import models.Rol;
import models.Seller;
import models.User;

import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.joda.time.DateTime;

import play.Play;
import play.data.DynamicForm;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import security.Roles;
import utils.Crypto;


public class Authentication extends Controller {
  
	private static final String currentUserIdKey = "currentUserId";
	private static final String appSecretFbKey = Play.application().configuration().getString("fb.appSecretKey");
	
    public static Result login() {
    	DynamicForm data = Form.form().bindFromRequest();
        String signedRequest = data.get("signedRequest");
        
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

                // Retrieve userId, register if necessary and create a session for it.
                String userIdText = Json.parse(signedData).get("user_id").getTextValue();
                Long userId = Long.parseLong(userIdText);
                User user = User.findById(userId);
                
                ObjectNode response = Json.newObject();
                ArrayNode userRoles = response.putArray("userRoles");
                                
                if (user == null)
                {
                	// Define main account usage: Seller, Buyer?
                	String accountUsage = data.get("accountUsage");
                	
                	// TODO: define how to manage situavion with no roles, shouldn't normally happend but it could.
                	if (accountUsage == null || accountUsage.isEmpty())
                		accountUsage = Roles.BUYER.getName();
                	
                	// Define user's name
                	String userFbname = data.get("fbName");
                	
                	// Register user in.
                	user = User.create(userId, userFbname);
                	
                	if (Roles.BUYER.getName() == accountUsage)
                		Buyer.createFor(userId);
                	else if (Roles.SELLER.getName() == accountUsage)
                		Seller.createFor(userId);
                } else {
                	user.lastLogin = DateTime.now();
                	user.save();
                }
                
            	if (user.name == null || user.name.isEmpty())
            		response.put("requestUserName", true); 
            	for(Rol rol : user.getRoles())
            	{
            		userRoles.add(rol.getName());
            	}
                
                session().clear();
                session(currentUserIdKey, userIdText);                      
                
                return ok(response);
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
        return currentUserId() != null? User.findById(Authentication.currentUserId()): null;
    }
}
