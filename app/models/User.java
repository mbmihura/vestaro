package models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import play.db.ebean.*;
import security.Roles;

@Entity
public class User extends Model {

    @Id
    public Long userId;
    public String name;
    @ManyToMany
    public Set<SecurityRole> roles;
    
    public User(Long userId, String name) {
      this.userId = userId;
      this.name = name;
      // TODO: Delete this, only for play-framework testing propose.
      //String[] rolesString = new String[myIntArray.length];
      this.roles = new HashSet<SecurityRole>();
      this.roles.add(SecurityRole.findByName(Roles.BUYER));
      //this.roles = myIntArray;
    }

    public static Finder<Long,User> find = new Finder<Long,User>(
        Long.class, User.class
    ); 

    public static User authenticate(Long userId) {
        return find.where().eq("userId", userId)
            .findUnique();
    }

    public static User create(Long userId, String name)
    {
      User newUser = new User(userId, name);
      newUser.save();
      return newUser;
    }

    public Roles[] getRoles()
    {      
    	Roles[] myIntArray = {Roles.SELLER};
       
      return myIntArray;
    }
}