package models;

import org.joda.time.DateTime;
import play.data.format.Formats;
import play.db.ebean.Model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

public class SellerPoint extends Model {
    @Id
    public Long id;
    @OneToOne
    public Seller seller;
    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:SS")
    public DateTime insertDate;
    public BigDecimal pointsValue;
    public Integer itemCount;
}
