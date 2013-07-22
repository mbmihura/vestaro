package models;
import java.util.*;
import javax.persistence.*;
import play.db.ebean.Model;

@Entity
public class Item extends Model {
	@Id
	public String id;
}
