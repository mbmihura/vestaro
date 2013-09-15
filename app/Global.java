import play.*;
import play.libs.*;
import security.Roles;

import java.util.*;

import com.avaje.ebean.*;

import models.*;

public class Global extends GlobalSettings {
	
    public void onStart(Application app) {
        InitialData.insert();
    }

    static class InitialData {

        @SuppressWarnings("unchecked")
		public static void insert() {

        	if (Rol.find.findRowCount() == 0)
            {
                for (Roles roleEnum : Roles.values())
                {
                    Rol role = new Rol();
                    role.name = roleEnum.getName();
                    role.save();
                }
            }
        	
            // If test user isn't set, create it.
            if (User.find.findRowCount() == 0)
            {
            	HashSet<Rol> rol = new HashSet<Rol>();
            	
            	rol.add(Rol.findByName(Roles.BUYER));
                User user = new User(563729055L,"testUserKurt", rol);
                user.save();
                
                user = new User(1406678834L,"testUserNaty", rol);
                user.save();
                
                user = new User(100000262980862L,"testUserAlan", rol);
                user.save();   
                
                user = new User(1335414847L,"testUserKurt", rol);
                user.save();
            }
            
            if(Ebean.find(Seller.class).findRowCount() == 0) {

                Map<String,List<Object>> all = (Map<String,List<Object>>)Yaml.load("initial-data.yml");

                // Insert sellers first
                Ebean.save(all.get("sellers"));

                // Insert collections
                Ebean.save(all.get("collections"));

                // Insert items
                Ebean.save(all.get("items"));

                // Insert the collections relations
//                for(Object collection: all.get("collections")) {
//                    Ebean.saveAssociation(collection,"owner");
//                }
//
//                // Insert the items relations
//                for(Object item: all.get("items")) {
//                    Ebean.saveAssociation(item,"owner");
//                }

            }
        }

    }

}