package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "requested_labors")
public class RequestedLabors {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "labor_type")
    private String laborType; // Correct field name

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "request_id")
    private int requestId;
}
