package utils;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.io.UnsupportedEncodingException;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;


/**
 * Crypto utilities.
 *
 * @author    Martin Mihura
 * @version   Release: 1.0.0
 */
public class Crypto {

    /**
     * Utility classes should not have a public or default constructor.
     */
    private Crypto() {
        throw new AssertionError();
    }

    /**
     * Retrieves the base64 for Url decode string for the given input.
     * @param urlBase64Encoded The string to decoded.
     * @return The decoded string.
     */
    public static String getBase64UrlDecode(final String urlBase64Encoded) {
        //Add '=' padding char, and replace '-' with '+' and '_' with '/' to get the signature's URLBase64 encoded version from the URLBase64 encoded one.
        String padding = "";
        switch (urlBase64Encoded.length() % 4) {
             case 0:
                 break;
             case 1:
                 padding = "===";
                 break;
             case 2:
                 padding = "==";
                 break;
             default:
                 padding = "=";
        }
        String base64EncodedSignature = urlBase64Encoded.replace("-", "+").replace("_", "/").trim() + padding;
        try {
           return new String(Base64.decodeBase64(base64EncodedSignature.getBytes("UTF-8")), "UTF-8");
        } catch (final UnsupportedEncodingException e)
        {
            throw new RuntimeException(e);
        }
    }

    /**
     * Retrieves the given input string hashed with HmacSHA256 algorithm.
     * @param data String to be hash.
     * @param secret scretkey used to hash the input data.
     * @return The resulting hash.
     */
    public static String getHashHmacSHA256(final String data, final String secret) {
        //Compute HMAC-SHA256 hash signature from the data recieved using secret code.
        try {
            final Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256");
            sha256_HMAC.init(secretKey);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes("UTF-8"));
            return new String(hash,"UTF-8");
        } 
        // HACK: Java 6 doesn't allow several inline exception catch.
        catch (final NoSuchAlgorithmException e)
        {
            throw new RuntimeException(e);
        } 
        catch ( final InvalidKeyException e)
        {
            throw new RuntimeException(e);
        }
        catch (final UnsupportedEncodingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
