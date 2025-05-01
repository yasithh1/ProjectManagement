package com.main.ProjectManager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmployerDTO {
    private String empId;
    private String firstName;
    private String lastName;
    private byte[] profilePic;
    private String position;
    private String address;
    private int phone;

    public EmployerDTO(String empId, String firstName, String lastName) {
        this.empId = empId;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

