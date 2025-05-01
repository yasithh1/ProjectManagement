package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Employer;
import com.main.ProjectManager.data.Labors;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LaborRepository extends JpaRepository<Labors, String> {
    Optional<Labors> findByLaborId(String laborId);
}
