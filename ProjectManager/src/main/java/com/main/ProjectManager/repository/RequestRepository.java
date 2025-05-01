package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request,Long>
{
    List<Request> findBysupplierEmail(String supplierEmail);
    List<Request> findByempId(String empId);

}
