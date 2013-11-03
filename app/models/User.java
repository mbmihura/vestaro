package models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import org.joda.time.DateTime;

import models.Buyer;
import play.db.ebean.*;
import security.Roles;

@SuppressWarnings("serial")
@Entity
public class User extends Model {

    @Id
    public Long userId;
    public String name;
    public DateTime creationDate;
    public DateTime lastLogin;
    @ManyToMany
    public Set<Rol> roles;
    
    private User(Long userId) {
      this.userId = userId;
      this.roles = new HashSet<Rol>();
    }

    public Set<Rol> getRoles()
    {      
      return roles;
    }
    /***
     * Add the given rol to the user. Preferred to addRoles(Roles rolEnum) due to performance issues.
     * @param rolInstance to be add to the user.
     * @return true if this user did not already contain the specified rol.
     */
    public boolean addRoles(Rol rolInstance)
    {      
      return roles.add(rolInstance);
    }
    /***
     * Add the given rol to the user. Discourage if addRoles(Rol rolInstance) can be used, due to performance issues.
     * @param rolEnum to be add to the user.
     * @return true if this user did not already contain the specified rol.
     */
    public boolean addRoles(Roles rolEnum)
    {      
      return roles.add(Rol.findByName(rolEnum.getName()));
    }
    
    // Static:
    public static Finder<Long,User> find = new Finder<Long,User>(Long.class, User.class); 

    public static User findById(Long userId) {
    	return find.byId(userId);
    }

    
    /**
     * Creates a new user in the DB and set initial values. This methods should be call to register a new user in the system.
     * @param fbUserId User facebook's id.
     * @return The new user entity.
     */
    public static User create(Long fbUserId)
    {
    	User newUser = new User(fbUserId);
    	newUser.creationDate = DateTime.now();
    	newUser.save();
    	return newUser;
    }
    
    /**
     * Creates a new user in the DB and set initial values. This methods should be call to register a new user in the system.
     * @param fbUserId User facebook's id, fbName User's real name (as display in facebook), authorizationRol User's roles.
     * @return The new user entity.
     */
    public static User create(Long fbUserId, String fbName)
    {
    	User newUser = create(fbUserId);
    	newUser.name = fbName;
    	newUser.save();
    	return newUser;
    }
}