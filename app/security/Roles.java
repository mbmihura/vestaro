package security;

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