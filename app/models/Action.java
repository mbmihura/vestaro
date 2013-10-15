package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints;
import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Action extends Model {
	@Id
    public Long id;

	@Constraints.Required
    @Constraints.MaxLength(30)
    public String action_type;

	@Constraints.Required
    public Long userId;

	@Constraints.Required
    public String itemId;

	@Constraints.Required
    public Long date;

    public static Finder<Long,Action> find = new Finder<Long,Action>(Long.class, Action.class);

    public static List<Action> findActionsFrom(String actionType, Long actionDateBegin, Long actionDateEnd, String itemId){
        return Action.find.where()
	    		.eq("itemId", itemId)
	    		.eq("action_type", actionType)
	    		.between("date", actionDateBegin == null ? 0L : actionDateBegin, actionDateEnd == null ? 29991231L : actionDateEnd)
		        .findList();
    }
}
