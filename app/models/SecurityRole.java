package models;

import play.db.ebean.Model;
import security.Roles;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class SecurityRole extends Model
{
    @Id
    public Long id;

    public String name;

    public static final Finder<Long, SecurityRole> find = new Finder<Long, SecurityRole>(Long.class,
                                                                                         SecurityRole.class);

    public String getName()
    {
        return name;
    }

    public static SecurityRole findByName(Roles role)
    {
        return find.where()
                   .eq("name",
                       role.getName())
                   .findUnique();
    }
}