package models;

import play.db.ebean.Model;
import security.Roles;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Rol extends Model
{
    @Id
    public long id;
    public String name;

    public String getName()
    {
        return name;
    }
   
    @Override
    public boolean equals(Object that) {
     if (that == null)
    	 return false;
     if (that == this)
    	 return true;
     if (!(that instanceof Rol))
    	 return false;
     Rol thatRol = (Rol) that;
     if (this.id != thatRol.id)
    	 return false;
     if (this.name == null || !this.name.equals(thatRol.name))
    	 return false;
    return true;
    }
    
    @Override
    public int hashCode() {
    	/* An initial value for a hashCode, to which is added contributions
    	   from fields. Using a non-zero value decreases collisons of hashCode
    	   values. */
	      int result = 17;
	      result = 31 * result + (int)( this.id ^ (this.id >>> 32) );
	      result = 31 * result + (this.name != null ? this.name.hashCode() : 0);
	      return result;
     }
    
    // Statics
    public static final Finder<Long, Rol> find = new Finder<Long, Rol>(Long.class,Rol.class);
    
    // can not be implement due to Ebean complain.
	//public static final Rol SELLER = findByName(Roles.SELLER);
	//public static final Rol BUYER = findByName(Roles.BUYER);

    public static Rol findByName(Roles role)
    {
        return find.where()
                   .eq("name",role.getName())
                   .findUnique();
    }

	public boolean is(Roles rol) {
		return this.getName().equals(rol.getName());
	}
    
    
}