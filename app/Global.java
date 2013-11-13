import java.util.List;
import java.util.Map;

import models.Buyer;
import models.Seller;
import models.User;
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

//    		if (Rol.find.findRowCount() == 0)
//    		{
//    			for (Roles roleEnum : Roles.values())
//    			{
//    				Rol role = new Rol();
//    				role.name = roleEnum.getName();
//    				role.save();
//    			}
//    		}
        	
//          // If test user isn't set, create it.
//    		if (User.find.findRowCount() == 0)
//    		{
//    			User user;
//            	Buyer buyer;
//           		Seller seller;
//            	
//            	user = User.create(563729055L,"testUserKurt");
//            	Buyer.createFor(user.userId);
//              Seller.createFor(user.userId);
//
//              user = User.create(1406678834L,"testUserNaty");
//              Buyer.createFor(user.userId);
//                   
//              user = User.create(100000262980862L,"testUserAlan");
//              Buyer.createFor(user.userId);
//              Seller.create(new Seller(user, 2L, "/assets/img/logo.jpg", "RopaHot", "www.example.com", false, 0.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
//                
//              user = User.create(1335414847L,"testUserPablo");
//              Buyer.createFor(user.userId);
//              Seller.create(new Seller(user, 1L, "/assets/img/logo.jpg", "RopaCool", "www.example.com", true, 1.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
//          }
            
            if(Ebean.find(Seller.class).findRowCount() == 0) {
            	
            	Map<String,List<Object>> all = (Map<String,List<Object>>)Yaml.load("initial-data.yml");

                // Insert roles
                Ebean.save(all.get("roles"));
            	
                // Insert users
                Ebean.save(all.get("users"));
                
                // Insert buyers for users
                for (User user : User.find.all()) {
					Buyer.createFor(user.userId);
				}
                
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
