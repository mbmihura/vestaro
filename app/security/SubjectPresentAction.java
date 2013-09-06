package security;

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
        // TODO: get current user
        if (false)
        {
            return delegate.call(context);
        }
        else
        {
            Logger.warn(String.format("Authorazation Module: User must be loggedIn to access [%s]",context.request().uri()));
            return unauthorized();
        }
    }
}