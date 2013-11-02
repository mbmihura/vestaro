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

//        	if (Rol.find.findRowCount() == 0)
//            {
//                for (Roles roleEnum : Roles.values())
//                {
//                    Rol role = new Rol();
//                    role.name = roleEnum.getName();
//                    role.save();
//                }
//            }
//        	
//            // If test user isn't set, create it.
//            if (User.find.findRowCount() == 0)
//            {
//            	HashSet<Rol> rol = new HashSet<Rol>();
//            	Buyer buyerManager = new Buyer();
//            	rol.add(Rol.findByName(Roles.BUYER));
//                
//            	User user = new User(563729055L,"testUserKurt", rol);
//            	user.save();
//                buyerManager.create(user);
//                
//                user = new User(1406678834L,"testUserNaty", rol);
//                user.save();
//                buyerManager.create(user);
//
//            	rol.add(Rol.findByName(Roles.SELLER));
//            	
//                user = new User(100000262980862L,"testUserAlan", rol);
//                user.save();   
//                buyerManager.create(user);
//                Seller.create(new Seller(user, 2L, "/assets/img/logo.jpg", "RopaHot", "www.example.com", false, 0.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
//                
//                user = new User(1335414847L,"testUserPablo", rol);
//                user.save();
//                buyerManager.create(user);
//                Seller.create(new Seller(user, 1L, "/assets/img/logo.jpg", "RopaCool", "www.example.com", true, 1.0, "uToiGVlNavrrbtjFX6ksHP51RQsG5and", "1406963671517811"));
//            }
            
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
                
                // Insert the collections relations
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
