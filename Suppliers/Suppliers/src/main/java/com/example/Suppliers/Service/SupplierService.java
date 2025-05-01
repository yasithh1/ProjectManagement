package com.example.Suppliers.Service;

import com.example.Suppliers.Controller.LoginResponse;
import com.example.Suppliers.Model.Supplier;
import com.example.Suppliers.Model.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService
{
         @Autowired
         private SupplierRepository supplierRepository;


    public SupplierService(SupplierRepository repository) {
        this.supplierRepository = repository;
    }

    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier authenticateSupplier(String email, String password)
    {
        Supplier supplier = supplierRepository.findByEmail(email);
        if (supplier != null && supplier.getPassword().equals(password))
        {
            return supplier;
        }

        return null;
    }

    public Supplier updateSupplier(Integer id, LoginResponse updateRequest)
    {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setFirstName(updateRequest.getFirstName());
        supplier.setLastName(updateRequest.getLastName());
        supplier.setEmail(updateRequest.getEmail());
        supplier.setTelephone(updateRequest.getTelephone());
        supplier.setPhoneNumber(updateRequest.getPhoneNumber());
        supplier.setAddress(updateRequest.getAddress());

        return supplierRepository.save(supplier);
    }

// Method to search suppliers by product category
public List<Supplier> findSuppliersByProductCategory(String productCategory)
{ return supplierRepository.findByProductCategory(productCategory); }
}
