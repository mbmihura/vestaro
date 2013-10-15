package models;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import play.test.FakeApplication;
import play.test.Helpers;

import com.avaje.ebean.Ebean;


public class BaseModelTest {
  public static FakeApplication app;
 
  @BeforeClass
  public static void startApp() {
	app = Helpers.fakeApplication(Helpers.inMemoryDatabase());
	Helpers.start(app);
	
    Seller seller1 = new Seller();
    seller1.id = (long) 4;
    Seller seller2 = new Seller();
    seller2.id = (long) 5;
    
    Ebean.save(seller1);
    Ebean.save(seller2);

  }
  
  @Test
  public void modelSaved() {
	  assertThat(Seller.find.all().size() == 2);
  }
  
  @AfterClass
  public static void stopApp() {
	  Helpers.stop(app);
  }

}