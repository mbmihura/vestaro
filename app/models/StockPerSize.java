package models;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Version;

import org.codehaus.jackson.annotate.JsonIgnore;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import com.avaje.ebean.annotation.CreatedTimestamp;

@SuppressWarnings("serial")
@Entity
public class StockPerSize extends Model {
	@Id
	public Long id;
	@Constraints.Required
	@Constraints.MaxLength(30)
	public String size;
	@Constraints.Required
	public Integer quantity;
	@Constraints.Required
	@OneToOne
	@JsonIgnore
	public Item item;
	@CreatedTimestamp
	Timestamp create_time;
	@Version
	Timestamp update_time;

	/***
	 * Decrease by one the size's stock quantity and save in db.
	 */
	public void consumeStockUnit() {
		this.quantity--;
		this.save();

	}

	public static Finder<String, StockPerSize> find = new Finder<String, StockPerSize>(String.class, StockPerSize.class);

	/***
	 * Returns the amounts per size for a given item.
	 */
	public static List<StockPerSize> findStockForItem(String itemId) {
		return StockPerSize.find.select("id, size, quantity, create_time, update_time").where().eq("item.id", itemId)
				.findList();
	}

	/***
	 * Returns the amounts per size for a given item which are greater than
	 * zero.
	 */
	public static List<StockPerSize> findAvailableStockForItem(String itemId) {
		return StockPerSize.find.select("id, size, quantity, create_time, update_time").where().eq("item.id", itemId)
				.gt("quantity", 0).findList();
	}
}
