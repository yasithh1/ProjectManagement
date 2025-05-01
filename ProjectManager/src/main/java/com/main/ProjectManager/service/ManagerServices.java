package com.main.ProjectManager.service;

import com.main.ProjectManager.data.DesignTask;
import com.main.ProjectManager.data.OngoingDesigns;
import com.main.ProjectManager.data.OngoingProject;
import com.main.ProjectManager.data.ProjectTask;
import com.main.ProjectManager.repository.DesignTaskRepository;
import com.main.ProjectManager.repository.OngoingDesignRepository;
import com.main.ProjectManager.repository.OngoingProjectRepository;
import com.main.ProjectManager.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ManagerServices {

    @Autowired
    private OngoingDesignRepository ongoingDesignRepository;

    @Autowired
    private OngoingProjectRepository ongoingProjectRepository;

    @Autowired
    private DesignTaskRepository designTaskRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Transactional
    public Map<String, Long> getStatusCountForAllDesigns() {
        // Step 1: Get all ongoing designs
        List<OngoingDesigns> ongoingDesigns = ongoingDesignRepository.findAll();

        if (ongoingDesigns.isEmpty()) {
            // If no ongoing designs exist, return an empty map
            return new HashMap<>();
        }

        // Step 2: Get all oDesignIds for the ongoing designs
        List<Integer> oDesignIds = ongoingDesigns.stream()
                .map(OngoingDesigns::getODesignId)
                .collect(Collectors.toList());

        // Step 3: Fetch all tasks for the designs using the oDesignIds
        List<DesignTask> designTasks = designTaskRepository.findAllByOdesignIdIn(oDesignIds);

        // Step 4: For each oDesignId, find the latest task by date
        Map<Integer, DesignTask> latestDesignTasks = designTasks.stream()
                .filter(task -> task.getDate() != null) // Filter out tasks with null dates
                .collect(Collectors.toMap(
                        DesignTask::getOdesignId, // Key by oDesignId
                        task -> task, // Value is the task itself
                        (task1, task2) -> task1.getDate().isAfter(task2.getDate()) ? task1 : task2 // Get the latest task based on the date
                ));

        // Step 5: Count the statuses for the latest tasks
        Map<String, Long> statusCountMap = new HashMap<>();
        for (DesignTask task : latestDesignTasks.values()) {
            String status = task.getStatus();
            // Increase count for each status, including "hold"
            statusCountMap.put(status, statusCountMap.getOrDefault(status, 0L) + 1);
        }

        // Step 6: Add a count for all designs
        statusCountMap.put("allDesigns", (long) ongoingDesigns.size());

        // Add a "hold" status count if it doesn't exist in the map, to ensure it shows up even with zero occurrences


        return statusCountMap;
    }

    @Transactional
    public Map<String, Long> getProjectStageCountForAllProjects() {
        // Step 1: Get all ongoing projects
        List<OngoingProject> ongoingProjects = ongoingProjectRepository.findAll();

        if (ongoingProjects.isEmpty()) {
            // If no ongoing projects exist, return an empty map
            return new HashMap<>();
        }

        // Step 2: Get all project IDs for the ongoing projects
        List<Integer> projectIds = ongoingProjects.stream()
                .map(OngoingProject::getOProjectId)
                .collect(Collectors.toList());

        // Step 3: Fetch all tasks for the projects using the project IDs
        List<ProjectTask> projectTasks = projectTaskRepository.findAllByProjectIdIn(projectIds);

        // Step 4: For each projectId, find the latest task by date
        Map<Integer, ProjectTask> latestProjectTasks = projectTasks.stream()
                .filter(task -> task.getDate() != null) // Filter out tasks with null dates
                .collect(Collectors.toMap(
                        ProjectTask::getProjectId, // Key by projectId
                        task -> task, // Value is the task itself
                        (task1, task2) -> task1.getDate().isAfter(task2.getDate()) ? task1 : task2 // Get the latest task based on the date
                ));

        // Step 5: Count the stages for the latest tasks
        Map<String, Long> stageCountMap = new HashMap<>();
        for (ProjectTask task : latestProjectTasks.values()) {
            String stage = task.getTaskStage();
            // Increase count for each stage
            stageCountMap.put(stage, stageCountMap.getOrDefault(stage, 0L) + 1);
        }

        // Step 6: Add a count for all projects
        stageCountMap.put("allProjects", (long) ongoingProjects.size());

        return stageCountMap;
    }
}
