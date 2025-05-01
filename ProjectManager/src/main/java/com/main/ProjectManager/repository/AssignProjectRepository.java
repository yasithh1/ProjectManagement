package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.AssignProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssignProjectRepository extends JpaRepository<AssignProject, Integer> {
    Optional<AssignProject> findByProjectAssignTo(String projectAssignTo);
}
