package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Supporter;
import com.main.ProjectManager.data.SupporterTask;
import com.main.ProjectManager.service.SupporterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/supporters")
public class SupporterController {

    @Autowired
    private SupporterService supporterService;

    // Create a supporter
    @PostMapping("/create-supporter")
    public ResponseEntity<Supporter> createSupporter(@RequestBody Supporter supporter) {
        Supporter newSupporter = supporterService.createSupporter(supporter);
        return ResponseEntity.ok(newSupporter);
    }

    @GetMapping("/by-request-to/{requestTo}")
    public ResponseEntity<List<Supporter>> getSupportersByRequestTo(@PathVariable String requestTo) {
        List<Supporter> supporters = supporterService.getSupportersByRequestTo(requestTo);
        return ResponseEntity.ok(supporters);
    }

    @PutMapping("/update-status/{supporterId}")
    public ResponseEntity<Supporter> updateSupporterStatus(@PathVariable String supporterId, @RequestParam String status) {
        Supporter updatedSupporter = supporterService.updateSupporterStatus(supporterId, status);
        return ResponseEntity.ok(updatedSupporter);
    }

    @GetMapping("/{requestBy}")
    public ResponseEntity<List<Supporter>> getSupporterByRequester(@PathVariable String requestBy) {
        List<Supporter> supporters = supporterService.getSupportersByRequester(requestBy);
        return ResponseEntity.ok(supporters);
    }

    // Create a supporter task
    @PostMapping("/create-supporter-task")
    public ResponseEntity<SupporterTask> createSupporterTask(@RequestBody SupporterTask supporterTask) {
        SupporterTask createdTask = supporterService.createSupporterTask(supporterTask);
        return ResponseEntity.ok(createdTask);
    }

    @GetMapping("/supporter/{supporterId}")
    public ResponseEntity<List<SupporterTask>> getTasksBySupporterId(@PathVariable String supporterId) {
        List<SupporterTask> tasks = supporterService.getTasksBySupporterId(supporterId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/update/{taskId}")
    public ResponseEntity<SupporterTask> updateCommentAndStatus(
            @PathVariable int taskId,
            @RequestParam String comment,
            @RequestParam String status) {
        SupporterTask updatedTask = supporterService.updateCommentAndStatus(taskId, comment, status);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
