package models;
import java.util.*;
import javax.persistence.*;
import play.db.ebean.Model;

@Entity
public class Item extends Model {
    @Id
    public String id;
    public String title;
    public String description;
    public String imgUrl;
    @OneToOne
    public Seller owner;
    @OneToOne
    public Collection collection;
}
