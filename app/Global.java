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
                
                // Insert categories
                Ebean.save(all.get("categories"));
                
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
