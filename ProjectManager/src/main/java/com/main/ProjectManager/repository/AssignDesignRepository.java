package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.AssignDesign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignDesignRepository extends JpaRepository<AssignDesign, Integer> {
    Optional<AssignDesign> findByassignTo(String assignTo);
    List<AssignDesign> findByAssignTo(String assignTo);
}
