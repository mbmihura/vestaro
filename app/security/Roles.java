package security;

import com.avaje.ebean.annotation.EnumMapping;

@EnumMapping(nameValuePairs="SELLER=S, BUYER=B, ADMIN=A")
public enum Roles
{
	SELLER,
	BUYER,
	ADMIN;
	
	public String getName()
	{
		return this.name();
	}
}