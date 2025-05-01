package com.main.ProjectManager.controller;

import com.main.ProjectManager.service.DesignService;
import com.main.ProjectManager.service.ManagerServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    @Autowired
    private ManagerServices managerServices;

    @GetMapping("/designs/status-count")
    public ResponseEntity<Map<String, Long>> getStatusCountForAllDesigns() {
        Map<String, Long> statusCount = managerServices.getStatusCountForAllDesigns();
        return ResponseEntity.ok(statusCount);
    }

    @GetMapping("/projects/stage-count")
    public ResponseEntity<Map<String, Long>> getProjectStageCountForAllProjects() {
        Map<String, Long> stageCount = managerServices.getProjectStageCountForAllProjects();
        return ResponseEntity.ok(stageCount);
    }
}
