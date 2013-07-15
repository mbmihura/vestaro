package models;

import java.util.*;
import javax.persistence.*;
import play.data.format.Formats;
import play.data.validation.Constraints;
import play.db.ebean.Model;

@Entity
public class Collection extends Model {
    @Id
    public Long id;

    @Constraints.Required
    @Formats.NonEmpty
    public String title;

    public String description;

    @OneToOne
    public Seller owner;

    @OneToMany
    public List<Item> items = new ArrayList<>();

    public static Finder<Long,Collection> find = new Finder(Long.class,Collection.class);
}
