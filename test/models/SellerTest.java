package models;

import org.junit.*;

import com.avaje.ebean.validation.AssertTrue;

import play.mvc.Content;
import static org.fest.assertions.Assertions.assertThat;
import static play.test.Helpers.contentType;


/**
*
* Simple (JUnit) tests that can call all parts of a play app.
* If you are interested in mocking a whole application, see the wiki for more details.
*
*/
public class SellerTest extends BaseModelTest {

    @Test
    public void SellerSimpleAssertion(){
    	Seller seller = new Seller();
    	seller.id = (long) 3;
    	seller.name = "RopaCool";
    	seller.save();
    	
    	assertThat(seller.id).isNotNull();
    	assertThat(Seller.find.byId((long)3).name).isEqualTo("RopaCool");
    }
}
