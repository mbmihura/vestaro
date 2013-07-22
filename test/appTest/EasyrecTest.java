package appTest;

import java.io.FileReader;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.junit.Assert;
import org.junit.Test;

public class EasyrecTest {
	
	@Test
    public void sendAction() {
		try {
			ScriptEngineManager manager = new ScriptEngineManager();

			ScriptEngine engine = manager.getEngineByName("JavaScript");
        
            engine.eval(new FileReader("public/javascripts/easyrec.js"));
            
            Invocable invEngine = (Invocable) engine;

            Object result = invEngine.invokeFunction("easyrec_buy", 
            		"{userId='1', itemId:'6', itemUrl:'http://example.com/item/1222', itemDescription:'Easyrec Fan Poster', itemImageUrl:'http://example.com/pics/poster.png'}");

            Assert.assertNotNull(result);
        } catch (Exception ex) {
            Assert.fail(ex.getMessage());
        }
    }
}
