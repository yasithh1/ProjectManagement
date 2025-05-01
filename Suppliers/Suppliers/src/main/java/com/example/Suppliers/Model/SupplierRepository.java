package com.example.Suppliers.Model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierRepository extends JpaRepository <Supplier, Integer>
{
    Supplier findByEmail(String email);
    List<Supplier> findByProductCategory(String productCategory);
}
