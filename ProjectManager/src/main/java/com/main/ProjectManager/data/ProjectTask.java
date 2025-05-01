package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "project_task")
public class ProjectTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    @Column(name = "task_stage")
    private String taskStage;

    @Column(name = "project_id")
    private int projectId;

    @Column(name = "date")
    private LocalDate date;
}
