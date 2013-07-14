package models;

import java.util.*;
import javax.persistence.*;

import org.joda.time.DateTime;
import play.data.format.Formats;
import play.db.ebean.Model;

@Entity
public class Seller extends Model {
    @Id
    public Long id;
    public Long fbUid;
    public String name;
    public Long merchantId;
    public String logoUrl;
    public String webpageUrl;
    @Formats.DateTime(pattern="yyyy/MM/dd HH:mm:SS")
    public DateTime insertDate;
    @OneToMany
    public List<SellerPoint> sellerPoints = new ArrayList<>();
    public SellerPoint activeSellerPoint;
    @OneToMany
    public List<Collection> collections = new ArrayList<>();
}
