package models;

import java.util.*;

import javax.persistence.*;

import play.data.format.Formats;
import play.data.validation.Constraints;
import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Collection extends Model {
    @Id
    public Long id;

    @Constraints.Required
    @Formats.NonEmpty
    public String title;

    public String description;

    @OneToOne
    public Seller seller;

    public static Finder<Long,Collection> find = new Finder<Long,Collection>(Long.class,Collection.class);
}
