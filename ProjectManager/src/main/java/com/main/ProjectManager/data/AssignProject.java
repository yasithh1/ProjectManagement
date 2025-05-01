package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "assign_projects")
public class AssignProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assign_pid")
    private int assignProjectId;

    @Column(name = "assign_to")
    private String projectAssignTo;

    @Column(name = "assign_by")
    private String projectAssignBy;

    @Column(name = "design_id")
    private int designId;

    @Column(name = "date", updatable = false)
    private LocalDateTime createdAt;

    @Lob
    @Column(name = "design")
    private byte[] design;

    public AssignProject(String projectAssignTo, String projectAssignBy, int designId, byte[] design) {
        this.projectAssignTo = projectAssignTo;
        this.projectAssignBy = projectAssignBy;
        this.designId = designId;
        this.design = design;
    }

    // No-args constructor required for JPA
    public AssignProject() {
    }
}
