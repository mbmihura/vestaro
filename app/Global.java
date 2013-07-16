import play.*;
import play.libs.*;

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