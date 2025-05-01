package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter@Getter@Entity@Table(name = "supporter_task")
public class SupporterTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private int taskId;

    @Column(name = "supporter_id")
    private String supporterId;

    @Column(name = "task")
    private String task;

    @Column(name = "status")
    private String status;

    @Column(name = "comment")
    private String comment;
}
