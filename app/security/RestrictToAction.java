package security;

import play.Logger;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import security.Roles;
import models.Rol;
import models.User;
import controllers.Authentication;

import java.util.Set;

public class RestrictToAction extends Action<RestrictTo>
{ 
    @Override
    public Result call(Http.Context context) throws Throwable
    {
    	User user = Authentication.currentUser();
    	if (user == null)
    	{
    		// User not logged, return unauthorized code and log situation.
            Logger.warn(String.format("Authorazation Module: User must be loggedIn to access [%s]",context.request().uri()));
            return unauthorized();
    	} else {
    		Set<Rol> userRoles = user.getRoles();
        	
	        // HACK: Save current user in context.args.put("currentUser", currentUser); so the controller can fetch it form context and avoids another search in db.
	
	        // For every role referenced in the annotation, search if the user's roles match at least one.
	        for (Roles rol : configuration.value())
	        {
	            for (Rol userRole : userRoles)
	            {
	            	//User is authorized, continue execution.
	                if (userRole.is(rol))
	                	return delegate.call(context);
	            }
	        }
	        // User does not have any of the required roles, return forbidden code and log situation.
	        Logger.warn(String.format("Authorazation Module: Not enough roles to access [%s]",context.request().uri()));
	        return forbidden();
    	}
    }
}