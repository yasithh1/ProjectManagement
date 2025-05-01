package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.sql.Date;

@Setter
@Getter
@Entity
@Table(name = "proposelocation")
public class ProposeLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proposeid")
    private int proposeId;

    @Column(name = "proposedby")
    private String proposedBy;

    @ManyToOne
    @JoinColumn(name = "location_id", referencedColumnName = "location_id")
    private Location location;

    @Column(name = "date", nullable = false)
    private Date date;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "details", length = 255)
    private String details;

    @Column(name = "reject/approve")
    private String rejectApprove;
}
