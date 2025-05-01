package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Employer;
import com.main.ProjectManager.dto.EmployerDTO;
import com.main.ProjectManager.service.EmployeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class EmployeController {

    @Autowired
    private EmployeService employeService;

    // Endpoint to create a new employee (employer)
    @PostMapping(path = "/employee")
    public Employer createEmployee(@RequestBody Employer employer) {
        return employeService.createEmployer(employer);
    }

    // Endpoint to get all employees
    @GetMapping(path = "/employee")
    public List<Employer> getEmployees() {
        return employeService.getAllEmployers();
    }

    // Endpoint to verify a user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        EmployerDTO employerDTO = employeService.login(email, password);

        if (employerDTO != null) {
            return ResponseEntity.ok(employerDTO);
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }

    // Endpoint to upload profile picture
    @PostMapping("/employee/{empId}/upload-image")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable String empId, @RequestParam("file") MultipartFile file) {
        try {
            Employer updatedEmployer = employeService.updateProfilePicture(empId, file);
            if (updatedEmployer != null) {
                return ResponseEntity.ok(updatedEmployer);
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "Employer not found"));
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error uploading image"));
        }
    }

    // Endpoint to update employer details (name, position, etc.)
    @PutMapping("/employee/{empId}/update-details")
    public ResponseEntity<?> updateEmployerDetails(@PathVariable String empId, @RequestBody Map<String, String> updates) {
        String firstName = updates.get("firstName");
        String lastName = updates.get("lastName");
        String position = updates.get("position");

        Employer updatedEmployer = employeService.updateEmployerDetails(empId, firstName, lastName, position);
        if (updatedEmployer != null) {
            return ResponseEntity.ok(updatedEmployer);
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Employer not found"));
        }
    }

    // Endpoint to get employer name by ID
    @GetMapping("/employee/{empId}/name")
    public ResponseEntity<EmployerDTO> getEmployerNameById(@PathVariable String empId) {
        EmployerDTO employerDTO = employeService.getEmployerNameById(empId);
        if (employerDTO != null) {
            return ResponseEntity.ok(employerDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Endpoint to get employer by ID
    @GetMapping("/employee/{empId}")
    public ResponseEntity<Employer> getEmployerById(@PathVariable String empId) {
        Employer employer = employeService.getEmployerById(empId);
        if (employer != null) {
            return ResponseEntity.ok(employer);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Endpoint to search employers by keyword
    @GetMapping("/employee/search")
    public ResponseEntity<List<EmployerDTO>> searchEmployers(@RequestParam String keyword) {
        List<EmployerDTO> employers = employeService.searchEmployers(keyword);
        return ResponseEntity.ok(employers);
    }
}
