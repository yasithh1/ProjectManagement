package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Integer> {
}
