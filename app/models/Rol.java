package models;

import play.db.ebean.Model;
import security.Roles;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Rol extends Model
{
    @Id
    public Long id;
    public String name;

    public String getName()
    {
        return name;
    }
   
    // Statics
    public static final Finder<Long, Rol> find = new Finder<Long, Rol>(Long.class,Rol.class);

    public static Rol findByName(Roles role)
    {
        return find.where()
                   .eq("name",role.getName())
                   .findUnique();
    }
}