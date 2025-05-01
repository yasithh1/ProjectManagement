package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.DesignTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DesignTaskRepository extends JpaRepository<DesignTask,Integer> {
    List<DesignTask> findAllByodesignId(int odesignId);  // Custom query method
    List<DesignTask> findAllByOdesignIdIn(List<Integer> odesignIds);
}
