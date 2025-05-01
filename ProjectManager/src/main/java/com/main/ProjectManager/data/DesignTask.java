package com.main.ProjectManager.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "design_task")
public class DesignTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dtask_id")
    private int dTaskId;

    @Column(name = "design_id")
    private int odesignId;

    @Column(name = "status")
    private String status;

    @Column(name = "date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
}
