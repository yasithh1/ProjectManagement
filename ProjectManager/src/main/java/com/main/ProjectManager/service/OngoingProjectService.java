package com.main.ProjectManager.service;

import com.main.ProjectManager.data.Meeting;
import com.main.ProjectManager.data.OngoingProject;
import com.main.ProjectManager.data.ProjectTask;
import com.main.ProjectManager.repository.OngoingProjectRepository;
import com.main.ProjectManager.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OngoingProjectService {

    @Autowired
    private OngoingProjectRepository ongoingProjectRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Transactional
    public OngoingProject createNewProject(OngoingProject ongoingProject) {
        OngoingProject savedOngoingProject = ongoingProjectRepository.save(ongoingProject);

        ProjectTask projectTask = new ProjectTask();
        projectTask.setProjectId(savedOngoingProject.getOProjectId());
        projectTask.setTaskStage("start");
        projectTask.setDate(LocalDate.now());


        ProjectTask savedProjectTask = projectTaskRepository.save(projectTask);

        return ongoingProjectRepository.save(savedOngoingProject);
    }

    @Transactional
    public Map<String, Long> getProjectStageCountByEmployer(String employer) {
        List<OngoingProject> ongoingProjects = ongoingProjectRepository.findBySupervisor(employer);

        if (ongoingProjects.isEmpty()) {
            return new HashMap<>();
        }

        List<Integer> projectIds = ongoingProjects.stream()
                .map(OngoingProject::getOProjectId)
                .collect(Collectors.toList());

        List<ProjectTask> projectTasks = projectTaskRepository.findAllByProjectIdIn(projectIds);

        Map<Integer, ProjectTask> latestProjectTasks = projectTasks.stream()
                .filter(task -> task.getDate() != null)
                .collect(Collectors.toMap(
                        ProjectTask::getProjectId,
                        task -> task,
                        (task1, task2) -> task1.getDate().isAfter(task2.getDate()) ? task1 : task2 // Get the latest task based on the date
                ));


        Map<String, Long> stageCountMap = new HashMap<>();
        for (ProjectTask task : latestProjectTasks.values()) {
            String stage = task.getTaskStage();
            stageCountMap.put(stage, stageCountMap.getOrDefault(stage, 0L) + 1);
        }


        stageCountMap.put("allProjects", (long) ongoingProjects.size());

        return stageCountMap;
    }

    @Transactional
    public List<ProjectTask> getTasksByProjectId(Integer projectId) {
        return projectTaskRepository.findAllByProjectId(projectId);
    }
    public List<OngoingProject> getProjectsBySupervisor(String supervisor)
    { return ongoingProjectRepository.findBySupervisor(supervisor); }

    @Transactional public ProjectTask updateTask(ProjectTask updatedTask)
    { Optional<ProjectTask> optionalTask = projectTaskRepository.findById(updatedTask.getTaskId());
        if (optionalTask.isPresent())
        { ProjectTask task = optionalTask.get(); task.setTaskStage(updatedTask.getTaskStage());
            task.setDate(updatedTask.getDate()); return projectTaskRepository.save(task); }
        else {
            throw new RuntimeException("Task not found with ID: " + updatedTask.getTaskId()); } }

    @Transactional
    public ProjectTask createNewTask(ProjectTask projectTask)
    { return projectTaskRepository.save(projectTask); }


    public boolean updateOngoingProject(
            Integer oProjectId,
            BigDecimal realBudget,
            MultipartFile vendorInvoice,
            MultipartFile supplierInvoice,
            MultipartFile appendices) {
        try {

            OngoingProject project = ongoingProjectRepository.findById(oProjectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));


            project.setRealBudget(realBudget);
            if (vendorInvoice != null) {
                project.setVendorInvoice(vendorInvoice.getBytes());
            }
            if (supplierInvoice != null) {
                project.setSupplierInvoice(supplierInvoice.getBytes());
            }
            if (appendices != null) {
                project.setAppendices(appendices.getBytes());
            }


            ongoingProjectRepository.save(project);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    public List<OngoingProject> getAllOngoingProjects() {
        return ongoingProjectRepository.findAll();
    }

    @Transactional
    public List<OngoingProject> getAllProjects() {
        return ongoingProjectRepository.findAll();
    }
    @Transactional
    public Optional<OngoingProject> getProjectById(Integer projectId) {
        return ongoingProjectRepository.findById(projectId);
    }
}
