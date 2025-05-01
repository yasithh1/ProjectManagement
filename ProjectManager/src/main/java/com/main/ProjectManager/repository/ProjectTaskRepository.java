package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Integer> {
    List<ProjectTask> findAllByProjectIdIn(List<Integer> projectIds);
    List<ProjectTask> findAllByProjectId(Integer projectId);
}
