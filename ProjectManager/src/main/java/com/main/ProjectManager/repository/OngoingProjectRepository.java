package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.OngoingProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OngoingProjectRepository extends JpaRepository<OngoingProject,Integer> {
    List<OngoingProject> findBySupervisor(String supervisor);

}
