package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Request;
import com.main.ProjectManager.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api10")
public class RequestController {

    @Autowired
    private RequestService requestService;

    // Create a new request
    @PostMapping("/request")
    public ResponseEntity<Request> createRequest(@RequestBody Request request) {
        Request createdRequest = requestService.createRequest(request);
        return ResponseEntity.ok(createdRequest);
    }

    // Get requests by supplier email
    @GetMapping("/supplier/{supplierEmail}")
    public ResponseEntity<List<Request>> getRequestsBySupplierEmail(@PathVariable String supplierEmail) {
        List<Request> requests = requestService.getRequestsBySupplierEmail(supplierEmail);
        return ResponseEntity.ok(requests);
    }
    // Change status of a request
    @PutMapping("/{id}/{status}")
    public ResponseEntity<Request> changeRequestStatus(@PathVariable Long id, @PathVariable String status)
    { Request updatedRequest = requestService.changeRequestStatus(id, status);
        return ResponseEntity.ok(updatedRequest); }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<List<Request>> getRequestsByEmpId(@PathVariable String empId)
    { List<Request> requests = requestService.getRequestsByEmpId(empId);
        return ResponseEntity.ok(requests); }
}
