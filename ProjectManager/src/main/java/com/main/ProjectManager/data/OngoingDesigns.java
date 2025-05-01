package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "ongoing_design")
public class OngoingDesigns {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "o_design_id")
    private int oDesignId;

    @Column(name = "design_name")
    private String designName;

    @Column(name = "expected_time")
    private Date expectedTime;

    @Column(name = "design_type")
    private String designType;

    @Column(name = "design_id")
    private int designId;

    @Column(name = "task_id")
    private int taskId;

    @Column(name = "status")
    private String status;

    @Column(name = "designer")
    private String designer;

    @Lob
    @Column(name = "design")
    private byte[] design;
}
