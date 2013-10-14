package models;

import java.math.BigDecimal;

import javax.persistence.Id;
import javax.persistence.OneToOne;

import org.joda.time.DateTime;

import play.data.format.Formats;
import play.db.ebean.Model;

@SuppressWarnings("serial")
public class SellerPoint extends Model {
    @Id
    public Long id;
    @OneToOne
    public Seller seller;
    @Formats.DateTime(pattern="yyyy-MM-dd hh:mm:ss")
    public DateTime insertDate = new DateTime();
    public BigDecimal pointsValue;
    public Integer itemCount;
}
