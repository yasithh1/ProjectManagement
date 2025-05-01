package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "outletlocation")
public class OutletLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "outletid")
    private int outletId;

    @Column(name = "outletname", length = 45, nullable = false)
    private String outletname;

    @ManyToOne
    @JoinColumn(name = "location_id", referencedColumnName = "location_id")
    private Location location;

    @Column(name = "profit_status", length = 45)
    private String profitStatus;

    @Column(name = "rent/purchased", length = 45)
    private String rentPurchased;
}
