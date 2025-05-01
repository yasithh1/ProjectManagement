package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.OngoingDesigns;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OngoingDesignRepository extends JpaRepository<OngoingDesigns, Integer> {
    List<OngoingDesigns> findByDesigner(String designer);
    List<OngoingDesigns> findByStatus(String status);
}
