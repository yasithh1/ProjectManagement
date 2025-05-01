package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employer,String> {
    Optional<Employer> findByEmail(String email);
    // Add custom query methods if needed, e.g., find by email or NIC
    @Query("SELECT e FROM Employer e WHERE e.firstName LIKE %:keyword% OR e.lastName LIKE %:keyword% OR e.position LIKE %:keyword%") List<Employer> searchEmployers(@Param("keyword") String keyword);
}