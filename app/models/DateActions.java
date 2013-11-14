package models;

public class DateActions {
	public Long date;
	public Integer actions_count;

	public DateActions(Long date){
		this.date = date;
		this.actions_count = 1;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
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
