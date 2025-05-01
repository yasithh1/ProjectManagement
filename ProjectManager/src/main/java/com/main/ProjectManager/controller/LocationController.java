package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Location;
import com.main.ProjectManager.data.OutletLocation;
import com.main.ProjectManager.data.ProposeLocation;
import com.main.ProjectManager.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api3")

public class LocationController {

    @Autowired
    private LocationService locationService;

    // Endpoint for handling propose form submission
    @PostMapping("/propose")
    public ProposeLocation createProposeLocation(@RequestBody ProposeLocation request) {
        return locationService.addProposeLocation(request);
    }

    // Endpoint for handling outlet form submission
    @PostMapping("/outlet")
    public OutletLocation createOutletLocation(@RequestBody OutletLocation request) {
        return locationService.addOutletLocation(request);
    }

    @GetMapping("/{proposedBy}")
    public ResponseEntity<List<ProposeLocation>> getProposeLocationsByProposedBy(@PathVariable("proposedBy") String proposedBy) {
        try {
            List<ProposeLocation> proposeLocations = locationService.getProposeLocationsByProposedBy(proposedBy);
            // If data is found, return a 200 OK response with the list of locations.
            if (!proposeLocations.isEmpty()) {
                return ResponseEntity.ok(proposeLocations);
            } else {
                // Return 404 Not Found if no locations are found for the given proposedBy.
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Handle unexpected exceptions.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    // Endpoint to get OutletLocation by ID along with its Location details
    @GetMapping("/outlet/{id}")
    public ResponseEntity<OutletLocation> getOutletLocation(@PathVariable("id") int outletLocationId) {
        try {
            OutletLocation outletLocation = locationService.getOutletLocationById(outletLocationId);
            return ResponseEntity.ok(outletLocation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Return a bad request with an error message
        }
    }
    // This method returns all ProposeLocations along with their Location details

    @GetMapping("/propose")
    public ResponseEntity<List<ProposeLocation>> getAllProposeLocations() {
        try {
            List<ProposeLocation> proposeLocations = locationService.getAllProposeLocations();
            return ResponseEntity.ok(proposeLocations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Return an internal server error
        }
    }

    // Endpoint to get all OutletLocations along with their Location details
    @GetMapping("/outlet")
    public ResponseEntity<List<OutletLocation>> getAllOutletLocations() {
        try {
            List<OutletLocation> outletLocations = locationService.getAllOutletLocations();
            return ResponseEntity.ok(outletLocations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Return an internal server error
        }
    }

    @PutMapping("/propose/{id}")
    public ResponseEntity<ProposeLocation> updateProposeLocation(@PathVariable int id, @RequestBody ProposeLocation request) {
        ProposeLocation updatedProposeLocation = locationService.updateProposeLocation(id, request);
        return ResponseEntity.ok(updatedProposeLocation);
    }

    @PutMapping("/outlet/{id}")
    public ResponseEntity<OutletLocation> updateOutletLocation(@PathVariable int id, @RequestBody OutletLocation request) {
        OutletLocation updatedOutletLocation = locationService.updateOutletLocation(id, request);
        return ResponseEntity.ok(updatedOutletLocation);
    }



    // Endpoint to delete an OutletLocation by ID

    @PutMapping("/propose/{proposeId}/status")
    public ResponseEntity<String> updateRejectApprove(@PathVariable int proposeId, @RequestParam String rejectApprove) {
        try {
            // Call the service method to update the rejectApprove status
            locationService.updateRejectApprove(proposeId, rejectApprove);

            // Return success response
            return ResponseEntity.ok("Proposal status updated successfully to " + rejectApprove);
        } catch (Exception e) {
            // Handle exception and return error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/locations/{locationId}")
    public ResponseEntity<String> deleteLocationAndProposeLocation(@PathVariable int locationId) {
        try {
            locationService.deleteLocation(locationId);

            return ResponseEntity.ok("Location and related ProposeLocation entries deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error occurred while deleting: " + e.getMessage());
        }
    }
    @GetMapping("/find/{locationId}")
    public ResponseEntity<Location> getLocationById(@PathVariable int locationId) {
        Location location = locationService.getLocationById(locationId);
        return ResponseEntity.ok(location);
    }
}
