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
            	// Buyer.create(563729055L,"testUserKurt");

                Buyer.create(1406678834L,"testUserNaty");
                   
                Buyer buyer = Buyer.create(100000262980862L,"testUserAlan");
                Seller.create(new Seller(buyer.user, 2L, "/assets/img/logo.jpg", "RopaHot", "www.example.com", false, 0.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
                
                buyer = Buyer.create(1335414847L,"testUserPablo");
                Seller.create(new Seller(buyer.user, 1L, "/assets/img/logo.jpg", "RopaCool", "www.example.com", true, 1.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
            }
            
            if(Ebean.find(Seller.class).findRowCount() == 0) {
            	
            	Map<String,List<Object>> all = (Map<String,List<Object>>)Yaml.load("initial-data.yml");

                // Insert collections
                Ebean.save(all.get("collections"));

                // Insert items
                Ebean.save(all.get("items"));
                
                // Insert stocks
                Ebean.save(all.get("stocks"));

                // Insert actions
                Ebean.save(all.get("actions"));
                
//                // Insert the collections relations
//                for(Object collection: all.get("collections")) {
//                    Ebean.saveAssociation(collection,"items");
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
