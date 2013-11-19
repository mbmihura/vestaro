package models;

import java.util.Comparator;

public class DateActions {
	public Long date;
	public Integer actions_count;

	public DateActions(Long date){
		this.date = date;
		this.actions_count = 1;
	}
	
	 public static class Comparators {

	        public static Comparator<DateActions> date = new Comparator<DateActions>() {
	            @Override
	            public int compare(DateActions o1, DateActions o2) {
	                return o1.date.compareTo(o2.date);
	            }
	        };
	 }
}
