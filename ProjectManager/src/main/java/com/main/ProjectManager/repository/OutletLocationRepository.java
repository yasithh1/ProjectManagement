package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.OutletLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OutletLocationRepository extends JpaRepository<OutletLocation, Integer> {
    List<OutletLocation> findByLocationLocationId(int locationId);
}
