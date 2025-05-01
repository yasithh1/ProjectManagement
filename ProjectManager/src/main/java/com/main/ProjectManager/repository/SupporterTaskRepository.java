package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.SupporterTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupporterTaskRepository extends JpaRepository<SupporterTask, Integer> {
    // Custom method to find tasks by supporter ID
    List<SupporterTask> findAllBySupporterId(String supporterId);
}
