package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.AssignLabors;
import com.main.ProjectManager.data.LaborRequest;
import com.main.ProjectManager.data.RequestedLabors;
import com.main.ProjectManager.service.LaborRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/labor-requests")
public class LaborRequestedController {

    @Autowired
    private LaborRequestService laborRequestService;

    @PostMapping("/request")
    public ResponseEntity<LaborRequest> createLaborRequest(@RequestBody LaborRequestData requestData) {
        LaborRequest laborRequest = laborRequestService.createLaborRequest(requestData.getProjectId(), requestData.getReceiver());
        laborRequestService.createRequestedLabors(laborRequest.getRequestId(), requestData.getLabors());
        return ResponseEntity.ok(laborRequest);
    }

    public static class LaborRequestData {
        private int projectId;
        private String receiver;
        private List<RequestedLabors> labors;

        // Getters and setters
        public int getProjectId() {
            return projectId;
        }

        public void setProjectId(int projectId) {
            this.projectId = projectId;
        }

        public String getReceiver() {
            return receiver;
        }

        public void setReceiver(String receiver) {
            this.receiver = receiver;
        }

        public List<RequestedLabors> getLabors() {
            return labors;
        }

        public void setLabors(List<RequestedLabors> labors) {
            this.labors = labors;
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<List<LaborRequest>> getAllRequests() {
        List<LaborRequest> requests = laborRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/assign")
    public ResponseEntity<?> createAssigns(@RequestBody AssignLabors assignLabors) {
        if (laborRequestService.isLaborAssignedAndNotSignedOut(assignLabors.getLaborId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Labor is already assigned and has not signed out");
        }

        AssignLabors createAssign = laborRequestService.createAssign(assignLabors);
        return ResponseEntity.ok(createAssign);
    }

    @GetMapping("/by-request")
    public ResponseEntity<List<AssignLabors>> getAllByRequestId(@RequestParam int requestId) {
        List<AssignLabors> assignLabors = laborRequestService.getAllByRequestId(requestId);
        return ResponseEntity.ok(assignLabors);
    }

    @PutMapping("/update-sign-out-date/{inputId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateSignOutDate(@PathVariable int inputId, @RequestBody LocalDate signOutDate) {
        laborRequestService.updateSignOutDate(inputId, signOutDate);
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<LaborRequest> getLaborRequestById(@PathVariable int requestId) {
        LaborRequest laborRequest = laborRequestService.getLaborRequestById(requestId);
        if (laborRequest != null) {
            return ResponseEntity.ok(laborRequest);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/check-assignable/{laborId}")
    public ResponseEntity<?> checkAssignable(@PathVariable String laborId) {
        boolean isAssignable = !laborRequestService.isLaborAssignedAndNotSignedOut(laborId);
        return ResponseEntity.ok().body(Collections.singletonMap("isAssignable", isAssignable));
    }

    @PutMapping("/update-pay-status/{assignId}")
    public ResponseEntity<Void> updatePayStatus(@PathVariable int assignId) {
        laborRequestService.updatePayStatus(assignId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/labors-with-signout")
    public ResponseEntity<List<AssignLabors>> getLaborsWithSignOut() {
        List<AssignLabors> laborsWithSignOut = laborRequestService.getAllLaborsWithSignOut();
        return ResponseEntity.ok(laborsWithSignOut);
    }
}
