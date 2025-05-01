package com.example.Suppliers.Controller;

public class LoginResponse {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String businessName;
    private String Telephone;
    private String PhoneNumber;
    private String address;

    // Constructor
    public LoginResponse(Integer id, String firstName, String lastName, String email, String businessName, String Telephone, String PhoneNumber, String address) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.businessName = businessName;
        this.Telephone = Telephone;
        this.PhoneNumber = PhoneNumber;
        this.address = address;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getTelephone() {
        return Telephone;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public String getAddress() {
        return address;
    }
}
