package models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import play.db.ebean.*;
import security.Roles;

@SuppressWarnings("serial")
@Entity
public class User extends Model {

    @Id
    public Long userId;
    public String name;
    @ManyToMany
    public Set<Rol> roles;
    
    public User(Long userId, String name, Set<Rol> roles) {
      this.userId = userId;
      this.name = name;
      this.roles = roles;
    }

    public Set<Rol> getRoles()
    {      
      return roles;
    }
    
    // Static:
    public static Finder<Long,User> find = new Finder<Long,User>(Long.class, User.class); 

    public static User findById(Long userId) {
    	return find
    			.where()
    			.eq("userId", userId)
                .findUnique();
    }

    public static User create(Long userId, String name)
    {
    	HashSet<Rol> rol = new HashSet<Rol>();
    	rol.add(Rol.findByName(Roles.BUYER));
    	User newUser = new User(userId, name, rol);
    	newUser.save();
    	return newUser;
    }
}