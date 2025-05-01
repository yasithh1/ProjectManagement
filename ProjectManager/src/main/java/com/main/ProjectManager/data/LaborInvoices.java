package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter@Getter@Entity@Table(name = "labor_invoice")
public class LaborInvoices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate IDs
    @Column(name = "vinvoice_id")
    private Long supporterId; // Change type to Long to use auto-generation

    @Column(name = "pdf")
    private byte[] pdf;

    @Column(name = "employer")
    private String employer;

    @Column(name = "date")
    private String date;

    @Column(name = "project_id")
    private Integer projectId;

}
