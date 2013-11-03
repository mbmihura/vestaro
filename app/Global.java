import java.util.List;
import java.util.Map;

import models.Seller;
import play.Application;
import play.GlobalSettings;
import play.libs.Yaml;

import com.avaje.ebean.Ebean;

public class Global extends GlobalSettings {
	
    public void onStart(Application app) {
        InitialData.insert();
    }

    static class InitialData {

        @SuppressWarnings("unchecked")
		public static void insert() {

            // if (Rol.find.findRowCount() == 0)
            // {
            //     for (Roles roleEnum : Roles.values())
            //     {
            //         Rol role = new Rol();
            //         role.name = roleEnum.getName();
            //         role.save();
            //     }
            // }
        	
            // // If test user isn't set, create it.
            // if (User.find.findRowCount() == 0)
            // {
            // 	// Buyer.create(563729055L,"testUserKurt");

            //     Buyer.create(1406678834L,"testUserNaty");
                   
            //     Buyer buyer = Buyer.create(100000262980862L,"testUserAlan");
            //     Seller.create(new Seller(buyer.user, 2L, "/assets/img/logo.jpg", "RopaHot", "www.example.com", false, 0.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
                
            //     buyer = Buyer.create(1335414847L,"testUserPablo");
            //     Seller.create(new Seller(buyer.user, 1L, "/assets/img/logo.jpg", "RopaCool", "www.example.com", true, 1.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
            // }
            
            if(Ebean.find(Seller.class).findRowCount() == 0) {
            	
            	Map<String,List<Object>> all = (Map<String,List<Object>>)Yaml.load("initial-data.yml");

                // Insert roles
                Ebean.save(all.get("roles"));
            	
                // Insert users
                Ebean.save(all.get("users"));

                // Insert sellers
                Ebean.save(all.get("sellers"));
                
                // Insert collections
                Ebean.save(all.get("collections"));

                // Insert items
                Ebean.save(all.get("items"));
                
                // Insert stocks
                Ebean.save(all.get("stocks"));

                // Insert actions
                Ebean.save(all.get("actions"));

            }
        }

    }

}
