// Controller
package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.DesignTask;
import com.main.ProjectManager.data.OngoingDesigns;
import com.main.ProjectManager.service.OngoingDesignsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api7/ongoing")
public class OngoingDesignController {

    @Autowired
    private OngoingDesignsService ongoingDesignsService;

    @PostMapping("/design")
    public ResponseEntity<OngoingDesigns> createDesignAssignment(@RequestBody OngoingDesigns ongoingDesigns) {
        OngoingDesigns createNewDesign = ongoingDesignsService.createNewDesign(ongoingDesigns);
        return new ResponseEntity<>(createNewDesign, HttpStatus.CREATED);
    }

    @GetMapping("/version/{designer}")
    public ResponseEntity<List<OngoingDesigns>> getVersionsByDesigner(@PathVariable("designer") String designer) {
        try {
            List<OngoingDesigns> ongoingDesigns = ongoingDesignsService.getDesignByDesigner(designer);
            if (!ongoingDesigns.isEmpty()) {
                return ResponseEntity.ok(ongoingDesigns);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/task/{odesignId}")
    public ResponseEntity<List<DesignTask>> getAllVersions(@PathVariable int odesignId) {
        List<DesignTask> designTasks = ongoingDesignsService.getTask(odesignId);

        if (designTasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(designTasks);
    }

    @PostMapping(path = "/task")
    public DesignTask createTask(@RequestBody DesignTask designTask) {
        // Print or log the design task to ensure the values are passed correctly
        System.out.println("Received design task: " + designTask.getOdesignId());
        return ongoingDesignsService.createTask(designTask);
    }
    @GetMapping("/status/{designer}")
    public ResponseEntity<Map<String, Long>> getStatusCountByDesigner(@PathVariable String designer) {
        Map<String, Long> statusCount = ongoingDesignsService.getStatusCountByDesigner(designer);

        if (statusCount.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if no data found
        }

        return ResponseEntity.ok(statusCount); // Return the status count
    }


    @PutMapping("/upload")
    public void uploadTaskImage(@RequestParam("oDesignId") int oDesignId,
                                @RequestParam("status") String status,
                                @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            System.out.println("oDesignId: " + oDesignId + ", status: " + status);
            ongoingDesignsService.updateStatusAndUploadImage(oDesignId, status, file);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update status or upload image");
        }
    }
    @GetMapping("/for-approval")
    public List<OngoingDesigns> getAllForApproval() {
        return ongoingDesignsService.getAllForApproval();
    }
    @GetMapping("/approved")
    public List<OngoingDesigns> getAllApproved() {
        return ongoingDesignsService.getAllApproved();
    }

}