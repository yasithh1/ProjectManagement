package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
@Table(name = "Employee")
@Entity

public class Employer {
    @Id
    @Column(name = "emp_id")
    private String empId;

    @Column(name = "position")
    private String position;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private int phoneNumber;

    @Lob
    private byte[] profilePic;


}


