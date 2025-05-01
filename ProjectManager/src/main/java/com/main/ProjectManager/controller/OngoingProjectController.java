package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Meeting;
import com.main.ProjectManager.data.OngoingProject;
import com.main.ProjectManager.data.ProjectTask;
import com.main.ProjectManager.service.OngoingProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/projects")
public class OngoingProjectController {

    @Autowired
    private OngoingProjectService ongoingProjectService;

    @PostMapping("/create")
    public ResponseEntity<OngoingProject> createNewProject(@RequestBody OngoingProject ongoingProject) {
        OngoingProject newProject = ongoingProjectService.createNewProject(ongoingProject);
        return ResponseEntity.ok(newProject);
    }

    @GetMapping("/by-supervisor/{supervisor}")
    public ResponseEntity<List<OngoingProject>> getProjectsBySupervisor(@PathVariable String supervisor) {
        List<OngoingProject> projects = ongoingProjectService.getProjectsBySupervisor(supervisor);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/stages-count/{employer}")
    public ResponseEntity<Map<String, Long>> getProjectStageCountByEmployer(@PathVariable String employer) {
        Map<String, Long> stageCount = ongoingProjectService.getProjectStageCountByEmployer(employer);
        return ResponseEntity.ok(stageCount);
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<ProjectTask>> getTasksByProjectId(@PathVariable Integer projectId) {
        List<ProjectTask> tasks = ongoingProjectService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/task") public ResponseEntity<ProjectTask> updateTask(@RequestBody ProjectTask updatedTask)
    { ProjectTask task = ongoingProjectService.updateTask(updatedTask);
        return ResponseEntity.ok(task); }

    @PostMapping("/task")
    public ResponseEntity<ProjectTask> createNewTask(@RequestBody ProjectTask projectTask)
    { ProjectTask newTask = ongoingProjectService.createNewTask(projectTask);
        return ResponseEntity.ok(newTask); }

    // Endpoint to handle file upload and update ongoing project
    @PutMapping("/upload")
    public ResponseEntity<String> updateOngoingProject(
            @RequestParam("oprojectId") Integer oProjectId,
            @RequestParam("realBudget") BigDecimal realBudget,
            @RequestParam(value = "vendorInvoice", required = false) MultipartFile vendorInvoice,
            @RequestParam(value = "supplierInvoice", required = false) MultipartFile supplierInvoice,
            @RequestParam(value = "appendices", required = false) MultipartFile appendices) {

        boolean isUpdated = ongoingProjectService.updateOngoingProject(
                oProjectId, realBudget, vendorInvoice, supplierInvoice, appendices);

        if (isUpdated) {
            return ResponseEntity.ok("Project updated successfully.");
        } else {
            return ResponseEntity.status(500).body("Failed to update the project.");
        }
    }

    @GetMapping("/projects")
    public ResponseEntity<List<OngoingProject>> getAllOngoingProject() {
        List<OngoingProject> ongoingProjects = ongoingProjectService.getAllOngoingProjects();
        return ResponseEntity.ok(ongoingProjects);
    }
    @GetMapping("/all")
    public ResponseEntity<List<OngoingProject>> getAllProjects() {
        List<OngoingProject> projects = ongoingProjectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    @GetMapping("/{projectId}")
    public ResponseEntity<OngoingProject> getProjectById(@PathVariable Integer projectId) {
        Optional<OngoingProject> project = ongoingProjectService.getProjectById(projectId);
        return project.map(ResponseEntity::ok) .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
