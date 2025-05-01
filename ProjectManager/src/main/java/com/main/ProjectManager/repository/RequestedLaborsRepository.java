package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.RequestedLabors;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestedLaborsRepository extends JpaRepository<RequestedLabors, Integer> {
}
