package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "contracts")
public class Contracts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contractid")
    private int contractId;

    @Column(name = "date")
    private java.util.Date date;

    @Column(name = "details")
    private String details;

    @Column(name = "contract_type")
    private String contractType;

    @Column(name = "location_id")
    private int locationId;

    @Column(name = "status")
    private String status;


}
