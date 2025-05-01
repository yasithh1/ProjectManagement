package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter@Getter@Entity@Table(name = "complains")
public class Complains {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "complain_id")
    private int complainId;

    @Column(name = "complainer")
    private String complainer;

    @Column(name = "viewer")
    private String viewer;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status")
    private String status;
}
