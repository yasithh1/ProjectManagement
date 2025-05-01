package com.example.Suppliers.Model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository  extends JpaRepository<Invoice,Long>
{
    List<Invoice> findByCustomerName(String customerName);
}
