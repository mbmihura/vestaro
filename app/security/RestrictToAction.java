package security;

import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import security.Roles;
import models.User;

import java.util.ArrayList;
import java.util.List;

public class RestrictToAction extends Action<RestrictTo>
{ 
    @Override
    public Result call(Http.Context context) throws Throwable
    {
        Result result;
        User current = User.authenticate(1L);
        Roles[] roles = current.getRoles();
        context.args.put("currentUser", current);

        for (Roles role : configuration.value())
        {
            for (Roles userRole : roles)
            {
                if (role.equals(userRole))
                return delegate.call(context);
            }
        }
        return forbidden();
    }
}