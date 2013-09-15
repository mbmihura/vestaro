package security;

import models.Rol;

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