package models;

import javax.persistence.*;
import play.db.ebean.*;
import com.avaje.ebean.*;
import security.Roles;

@Entity
public class User extends Model {

    @Id
    public Long userId;
    public String name;
    
    public User(Long userId, String name) {
      this.userId = userId;
      this.name = name;
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
      Roles[] myIntArray = {Roles.buyer};
      return myIntArray;
    }
}