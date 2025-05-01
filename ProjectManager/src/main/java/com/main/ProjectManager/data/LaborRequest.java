package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "labor_request")
public class LaborRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private int requestId;

    @Column(name = "project_id")
    private int projectId;

    @Column(name = "reciver")
    private String receiver;

    @Column(name = "status")
    private String status;

    @Column(name = "date")
    private LocalDate date; // Changed to String as per your columns specification
}
