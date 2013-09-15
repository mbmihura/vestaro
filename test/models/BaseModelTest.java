package models;

import java.util.List;
import java.util.Map;

import org.junit.*;
import static org.fest.assertions.Assertions.*;

import com.avaje.ebean.Ebean;

import play.libs.Yaml;
import play.test.*;
import models.*;


public class BaseModelTest {
  public static FakeApplication app;
 
  @SuppressWarnings("unchecked")
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