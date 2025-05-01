package com.main.ProjectManager.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "supporter_request")
public class Supporter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate IDs
    @Column(name = "supporter_id")
    private Long supporterId; // Change type to Long to use auto-generation

    @Column(name = "assign_project_id")
    private String ProjectId;

    @Column(name = "request_by")
    private String requestBy;

    @Column(name = "request_to")
    private String requestTo;

    @Column(name = "status")
    private String status;
}
