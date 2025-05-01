package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "assign_labors")
public class AssignLabors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assign_id")
    private int assignId;

    @Column(name = "labor_id")
    private String laborId;

    @Column(name = "request_id")
    private int requestedID;

    @Column(name = "date")
    private LocalDate date;

    @Column(name="sign_out_date")
    private LocalDate signOutDate;

    @Column(name="pay_status")
    private LocalDate payStatus;

    @ManyToOne
    @JoinColumn(name = "request_id", insertable = false, updatable = false)
    private LaborRequest request;


}
