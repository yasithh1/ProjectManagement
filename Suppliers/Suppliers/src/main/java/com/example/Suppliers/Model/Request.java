package com.example.Suppliers.Model;

public class Request {
    private String productName;
    private int quantity;
    private String requesterEmail;
    private String requesterPhoneNumber;
    private String supplierEmail;

    // Getters and Setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public String getRequesterPhoneNumber() {
        return requesterPhoneNumber;
    }

    public void setRequesterPhoneNumber(String requesterPhoneNumber) {
        this.requesterPhoneNumber = requesterPhoneNumber;
    }

    public String getSupplierEmail() {
        return supplierEmail;
    }

    public void setSupplierEmail(String supplierEmail) {
        this.supplierEmail = supplierEmail;
    }
}
