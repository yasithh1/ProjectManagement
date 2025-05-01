package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "ongoing_projects")
public class OngoingProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "o_project_id")
    private Integer oProjectId;

    @Column(name = "suppervisor")
    private String supervisor;

    @Column(name = "status")
    private String status;

    @Lob
    @Column(name = "vendor_invoice")
    private byte[] vendorInvoice;

    @Lob
    @Column(name = "supplier_invoice")
    private byte[] supplierInvoice;

    @Column(name = "project_name")
    private String projectName;
    @Lob
    @Column(name = "appendices")
    private byte[] appendices;

    @Column(name = "assign_project_id")
    private Integer assignProjectId;

    @Column(name = "expected_time")
    private Date expectedTime;

    @Column(name = "end_time")
    private LocalDate endTime;

    @Column(name = "expected_budget", precision = 9, scale = 6)
    private BigDecimal expectedBudget;

    @Column(name = "real_budget", precision = 9, scale = 6)
    private BigDecimal realBudget;
}
