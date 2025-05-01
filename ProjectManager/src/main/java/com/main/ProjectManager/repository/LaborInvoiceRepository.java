package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.LaborInvoices;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LaborInvoiceRepository extends JpaRepository<LaborInvoices, Integer> {
    List<LaborInvoices> findByEmployer(String employer);
}
