package security;

import controllers.Authentication;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Action;
import play.Logger;

/**
 * Implements the {@link SubjectPresent} functionality, i.e. a {@link be.objectify.deadbolt.core.models.Subject} must be provided by the
 * {@link be.objectify.deadbolt.java.DeadboltHandler} to have access to the resource, but no role checks are performed.
 *
 * @author Steve Chaloner (steve@objectify.be)
 */
public class SubjectPresentAction extends Action<SubjectPresent>
{
     @Override
    public Result call(Http.Context context) throws Throwable
    {
    	 Long userId = Authentication.currentUserId();
         // HACK: Save current userId in context.args.put("currentUserId", userId); so the controller can fetch it form context and avoids another search in db.

        if (userId != null)
        {
        	//If user is logged, continue execution.
            return delegate.call(context);
        }
        else
        {
        	// User not logged, return unauthorized code and log situation.
            Logger.warn(String.format("Authorazation Module: User must be loggedIn to access [%s]",context.request().uri()));
            return unauthorized();
        }
    }
}