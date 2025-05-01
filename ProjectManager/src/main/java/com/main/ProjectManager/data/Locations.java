package com.main.ProjectManager.data;
import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@Entity
@Table(name = "propose_location")
public class Locations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private int locationId;

    @Column(name = "longitude")
    private double longitude;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "location_type")
    private String locationType;

    @Column(name = "proposed_by")
    private String proposedBy;

    @Column(name = "date")
    private Date date;

    @Column(name = "details")
    private String details;


}
