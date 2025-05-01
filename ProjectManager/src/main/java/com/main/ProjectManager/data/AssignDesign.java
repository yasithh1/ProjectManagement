package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Table(name = "assign_designs")
@Entity
public class AssignDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assign_id")
    private int assignId;

    @Column(name = "assign_to")
    private String assignTo;

    @Column(name = "assign_by")
    private String assignBy;

    @Column(name = "contract_id")
    private int contractId;
    @Column(name = "date", updatable = false)
    private java.util.Date createdAt;


}
