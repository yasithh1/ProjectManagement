package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "request")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "engineer_id")
    private String empId;

    @Column(name = "phone_number")
    private int number;

    @Column(name = "supplier_email")
    private String supplierEmail;

    @Column(name = "status")
    private String status;

}
