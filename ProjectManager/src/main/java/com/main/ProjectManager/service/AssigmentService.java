package com.main.ProjectManager.service;

import com.main.ProjectManager.data.AssignDesign;
import com.main.ProjectManager.data.AssignProject;
import com.main.ProjectManager.repository.AssignDesignRepository;
import com.main.ProjectManager.repository.AssignProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssigmentService {

    @Autowired
    private AssignDesignRepository assignDesignRepository;

    @Autowired
    private AssignProjectRepository assignProjectRepository;

    public AssignDesign createDesignAssigment(AssignDesign assignDesign) {
        return assignDesignRepository.save(assignDesign);
    }

    public AssignProject createProjectAssignment(AssignProject assignProject) {
        return assignProjectRepository.save(assignProject);
    }

    public AssignDesign getDesignAssigmentbyId(String assignTo) {
        return assignDesignRepository.findByassignTo(assignTo).orElse(null);
    }

    public AssignProject getProjectAssigmentbyId(String ProjectAssignTo) {
        return assignProjectRepository.findByProjectAssignTo(ProjectAssignTo).orElse(null);
    }

    // Method to get all design assignments by assignTo
    public List<AssignDesign> getAllDesignAssignmentsByAssignTo(String assignTo) {
        return assignDesignRepository.findByAssignTo(assignTo);
    }
}
