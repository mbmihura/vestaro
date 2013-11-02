package models;

import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Version;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import com.avaje.ebean.annotation.CreatedTimestamp;

@SuppressWarnings("serial")
	
@Entity
public class Stock extends Model {
    @Id
    public String id;

    @Constraints.Required
    @Constraints.MaxLength(30)
    public String size;

    @Constraints.Required
    public Integer stock;
    
    @Constraints.Required
    @OneToOne
    public Item item;
    
    @CreatedTimestamp
    Timestamp create_time;

    @Version
    Timestamp update_time;

    public static Finder<String,Stock> find = new Finder<String,Stock>(String.class, Stock.class);

    public static List<Stock> findStockOfItem(String itemId){
        return Stock.find.where()
                .eq("item.id", itemId)
                .findList();
    }

    public static LinkedHashMap<String, String> findAvailableSizeOptions(String itemId){
             LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        for(Stock sizeStock: Stock.find.where().eq("item.id", itemId).findList()) {
        	if(sizeStock.stock !=0){
        		options.put(sizeStock.id.toString(), sizeStock.size);
        	}
        }
        return options;
    }

    public static Stock submit(Stock stock) {
    	stock.save();
    	return stock;
    }
    
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Stock [id=")
                .append(id)
                .append(", size=")
                .append(size)
                .append(", stock=")
                .append(stock)
                .append(", item=")
                .append(item.title)
                .append(", create_time=")
                .append(create_time)
                .append(", update_time=")
                .append(update_time)
                .append("]");
        return builder.toString();
    }

}
