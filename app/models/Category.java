package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.db.ebean.Model.Finder;

@SuppressWarnings("serial")
@Entity
public class Category extends Model {
	
	@Id
	public Long id;
	
	@Constraints.Required
    @Constraints.MaxLength(30)
	public String title;
	
	public static Finder<Long,Category> find = new Finder<Long,Category>(Long.class, Category.class);
	
}
