package models;

import javax.persistence.*;

import org.joda.time.DateTime;

import play.data.format.Formats;
import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Seller extends Model {
    @Id
    public Long id;
    public Long fbUid;
    public String name;
    public Long merchantId;
    public String logoUrl;
    public String webpageUrl;
    @Formats.DateTime(pattern="yyyy-MM-dd hh:mm:ss")
    public DateTime insertDate;
    public SellerPoint activeSellerPoint;

    public static Finder<Long,Seller> find = new Finder<Long,Seller>(Long.class,Seller.class);

}
