package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Designs;
import com.main.ProjectManager.service.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/design")
public class DesignController {

    @Autowired
    private DesignService designService;

    // Endpoint to fetch all designs
    @GetMapping("/all")
    public ResponseEntity<?> getAllDesigns() {
        return ResponseEntity.ok(designService.getAllDesigns());
    }

    // Endpoint to fetch design by ID
    @GetMapping("/{designId}")
    public ResponseEntity<?> getDesignById(@PathVariable int designId) {
        Optional<Designs> design = designService.getDesignById(designId);
        return design.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST endpoint to add a design
    @PostMapping("/add")
    public ResponseEntity<Designs> addDesign(
            @RequestParam("designName") String designName,
            @RequestParam("location_id") int locationId,
            @RequestParam("updatedBy") String updatedBy,
            @RequestParam("status") String status,
            @RequestParam("updatedTime") String updatedTime,
            @RequestParam("design") MultipartFile designFile) {

        try {
            // Convert updatedTime from String to Date
            Date updatedTimeDate = Date.valueOf(updatedTime);

            // Create a new design object using the constructor
            Designs newDesign = new Designs(designName, locationId, updatedBy, status, updatedTimeDate, designFile.getBytes());

            // Call the service to save the design
            Designs savedDesign = designService.addDesign(newDesign); // Only pass the newDesign object

            // Return the saved design as a response
            return ResponseEntity.ok(savedDesign);
        } catch (Exception e) {
            // Log the error message for debugging
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Endpoint to get the design image (profile picture)
    @GetMapping("/view-image/{designId}")
    public ResponseEntity<?> viewDesignImage(@PathVariable int designId) throws Exception {
        byte[] image = designService.getDesignImage(designId);
        return ResponseEntity.ok().header("Content-Type", "image/jpeg").body(image);
    }

    // Endpoint to update design information
    @PutMapping("/update/{designId}")
    public ResponseEntity<?> updateDesign(
            @PathVariable int designId,
            @RequestParam("status") String status,
            @RequestParam("updatedBy") String updatedBy) {

        try {
            // Retrieve existing design
            Optional<Designs> existingDesign = designService.getDesignById(designId);
            if (!existingDesign.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Update the design with new details
            Designs design = existingDesign.get();
            design.setStatus(status);
            design.setUpdatedBy(updatedBy);

            // Save updated design
            Designs updatedDesign = designService.updateDesign(designId, design);

            // Return the updated design as a response
            return ResponseEntity.ok(updatedDesign);
        } catch (Exception e) {
            // Log the error message for debugging
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
