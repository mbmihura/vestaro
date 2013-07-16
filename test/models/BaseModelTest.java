package models;

import org.junit.*;
import play.test.*;
import models.*;


public class BaseModelTest {
  public static FakeApplication app;
 
  @BeforeClass
  public static void startApp() {
    app = Helpers.fakeApplication(Helpers.inMemoryDatabase());
    Helpers.start(app);
  }
 
  @AfterClass
  public static void stopApp() {
    Helpers.stop(app);
  }
}