package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.AssignDesign;
import com.main.ProjectManager.data.AssignProject;
import com.main.ProjectManager.service.AssigmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api6/assignments")
public class AssignController {

    @Autowired
    private AssigmentService assigmentService;

    // Create Design Assignment
    @PostMapping("/design")
    public ResponseEntity<AssignDesign> createDesignAssignment(@RequestBody AssignDesign assignDesign) {
        AssignDesign createdAssignment = assigmentService.createDesignAssigment(assignDesign);
        return new ResponseEntity<>(createdAssignment, HttpStatus.CREATED);
    }

    @PostMapping("/project")
    public ResponseEntity<AssignProject> createProjectAssignment(
            @RequestParam("projectAssignTo") String projectAssignTo,
            @RequestParam("projectAssignBy") String projectAssignBy,
            @RequestParam("designId") int designId,
            @RequestParam("design") MultipartFile designFile) {

        try {
            AssignProject newAssignment = new AssignProject(projectAssignTo, projectAssignBy, designId, designFile.getBytes());
            AssignProject savedAssignment = assigmentService.createProjectAssignment(newAssignment);
            return new ResponseEntity<>(savedAssignment, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    // Get Design Assignment by 'assignTo'
    @GetMapping("/design/{assignTo}")
    public ResponseEntity<AssignDesign> getDesignAssignmentById(@PathVariable String assignTo) {
        AssignDesign designAssignment = assigmentService.getDesignAssigmentbyId(assignTo);
        if (designAssignment != null) {
            return new ResponseEntity<>(designAssignment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get Project Assignment by 'ProjectAssignTo'
    @GetMapping("/project/{ProjectAssignTo}")
    public ResponseEntity<AssignProject> getProjectAssignmentById(@PathVariable String ProjectAssignTo) {
        AssignProject projectAssignment = assigmentService.getProjectAssigmentbyId(ProjectAssignTo);
        if (projectAssignment != null) {
            return new ResponseEntity<>(projectAssignment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // Endpoint to get all design assignments by assignTo
    @GetMapping("/designs/{assignTo}")
    public List<AssignDesign> getAllDesignAssignmentsByAssignTo(@PathVariable String assignTo) {
        return assigmentService.getAllDesignAssignmentsByAssignTo(assignTo);
    }
}
