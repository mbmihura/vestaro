package models;

import java.util.Calendar;
import java.util.Date;
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

    public Action(String actionType, Long userId, String itemId, Date date) {
    	this.action_type = actionType;
    	this.userId=userId;
    	this.itemId = itemId;
    	Calendar cal = Calendar.getInstance();
    	cal.setTime(date);
    	this.date =  (long) (cal.get(Calendar.YEAR)*10000 + (cal.get(Calendar.MONTH)+1)*100) + cal.get(Calendar.DAY_OF_MONTH);
    	
    }


	public Action() {
	}


	public static List<Action> findActionsFrom(String actionType, Long actionDateBegin, Long actionDateEnd, String itemId){
        return Action.find.where()
	    		.eq("itemId", itemId)
	    		.eq("action_type", actionType)
	    		.between("date", actionDateBegin == null ? 0L : actionDateBegin, actionDateEnd == null ? 29991231L : actionDateEnd)
		        .findList();
    }
    
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		DateActions other = (DateActions) obj;
		if (date == null) {
			if (other.date != null)
				return false;
		} else if (!date.equals(other.date))
			return false;
		return true;
	}
    
}
