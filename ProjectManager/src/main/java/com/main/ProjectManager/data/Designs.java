package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@Entity
@Table(name = "designs")
public class Designs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "design_id")
    private int designId;

    @Column(name = "design_name")
    private String designName;

    @Column(name = "location_id")
    private int location_id;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "status")
    private String status;

    @Column(name = "updated_time")
    private Date updatedTime;

    @Lob
    private byte[] design;

    // Add constructor with all fields
    public Designs(String designName, int location_id, String updatedBy, String status, Date updatedTime, byte[] design) {
        this.designName = designName;
        this.location_id = location_id;
        this.updatedBy = updatedBy;
        this.status = status;
        this.updatedTime = updatedTime;
        this.design = design;
    }

    // No-args constructor (optional, but commonly used for JPA)
    public Designs() {
    }
}
