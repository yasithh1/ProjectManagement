package com.main.ProjectManager.service;

import com.main.ProjectManager.data.Location;
import com.main.ProjectManager.data.OutletLocation;
import com.main.ProjectManager.data.ProposeLocation;
import com.main.ProjectManager.repository.LocationRepository;
import com.main.ProjectManager.repository.OutletLocationRepository;
import com.main.ProjectManager.repository.ProposeLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;


import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ProposeLocationRepository proposeLocationRepository;

    @Autowired
    private OutletLocationRepository outletLocationRepository;


    // This method handles the insertion for the propose form
    @Transactional
    public ProposeLocation addProposeLocation(ProposeLocation request) {
        // Step 1: Insert location into the Location table
        Location location = new Location();
        location.setLongitude(request.getLocation().getLongitude());
        location.setLatitude(request.getLocation().getLatitude());
        location.setDistrict(request.getLocation().getDistrict());
        location.setProvince(request.getLocation().getProvince());

        locationRepository.save(location); // Save to get the locationId

        // Step 2: Get the generated locationId from the Location table
        int locationId = location.getLocationId();

        // Step 3: Insert the propose location
        ProposeLocation proposeLocation = new ProposeLocation();
        proposeLocation.setProposedBy(request.getProposedBy());

        // Ensure the date is not null (add validation if necessary)
        if (request.getDate() != null) {
            proposeLocation.setDate(request.getDate());
        } else {
            // You can throw a custom exception here or set a default value if date is required
            throw new IllegalArgumentException("Date cannot be null");
        }

        // Ensure the type is not null (add validation if necessary)
        if (request.getType() != null && !request.getType().isEmpty()) {
            proposeLocation.setType(request.getType());
        } else {
            // You can throw a custom exception here if type is required
            throw new IllegalArgumentException("Type cannot be null or empty");
        }

        proposeLocation.setDetails(request.getDetails());

        // Set the Location object (foreign key)
        Location locationForPropose = new Location();
        locationForPropose.setLocationId(locationId);
        proposeLocation.setLocation(locationForPropose);

        return proposeLocationRepository.save(proposeLocation); // Save to ProposeLocation table
    }


    // This method handles the insertion for the outlet form
    @Transactional
    public OutletLocation addOutletLocation(OutletLocation request) {
        // Step 1: Insert location into the Location table
        Location location = new Location();
        location.setLongitude(request.getLocation().getLongitude());
        location.setLatitude(request.getLocation().getLatitude());
        location.setDistrict(request.getLocation().getDistrict());
        location.setProvince(request.getLocation().getProvince());

        locationRepository.save(location); // Save to get the locationId

        // Step 2: Get the generated locationId from the Location table
        int locationId = location.getLocationId();

        // Step 3: Insert the outlet location
        OutletLocation outletLocation = new OutletLocation();
        outletLocation.setOutletname(request.getOutletname());
        outletLocation.setProfitStatus(request.getProfitStatus());
        outletLocation.setRentPurchased(request.getRentPurchased());

        // Set the Location object (foreign key)
        Location locationForOutlet = new Location();
        locationForOutlet.setLocationId(locationId);
        outletLocation.setLocation(locationForOutlet);

        return outletLocationRepository.save(outletLocation); // Save to OutletLocation table
    }


    // This method fetches all ProposeLocation entries with the given proposedBy value.
    public List<ProposeLocation> getProposeLocationsByProposedBy(String proposedBy) {
        return proposeLocationRepository.findByProposedBy(proposedBy);
    }


    // This method retrieves an OutletLocation by its ID along with its associated Location details
    @Transactional(readOnly = true)
    public OutletLocation getOutletLocationById(int outletLocationId) {
        // Find the OutletLocation by ID
        OutletLocation outletLocation = outletLocationRepository.findById(outletLocationId)
                .orElseThrow(() -> new IllegalArgumentException("OutletLocation not found with ID: " + outletLocationId));

        // Fetch the Location associated with this OutletLocation
        Location location = outletLocation.getLocation();

        // You can return both OutletLocation and associated Location (if needed)
        outletLocation.setLocation(location);

        return outletLocation;
    }

    @Transactional
    public List<ProposeLocation> getAllProposeLocations() {
        return proposeLocationRepository.findAll(); // Get all propose locations
    }

    // This method returns all OutletLocations along with their Location details
    @Transactional
    public List<OutletLocation> getAllOutletLocations() {
        return outletLocationRepository.findAll(); // Get all outlet locations
    }

    @Transactional
    public ProposeLocation updateProposeLocation(int proposeLocationId, ProposeLocation request) {
        // Check if the ProposeLocation exists
        ProposeLocation existingProposeLocation = proposeLocationRepository.findById(proposeLocationId)
                .orElseThrow(() -> new IllegalArgumentException("ProposeLocation not found with ID: " + proposeLocationId));

        // Update the fields with the request data
        existingProposeLocation.setProposedBy(request.getProposedBy());

        // Ensure the date is valid
        if (request.getDate() != null) {
            existingProposeLocation.setDate(request.getDate());
        } else {
            throw new IllegalArgumentException("Date cannot be null");
        }

        // Ensure the type is valid
        if (request.getType() != null && !request.getType().isEmpty()) {
            existingProposeLocation.setType(request.getType());
        } else {
            throw new IllegalArgumentException("Type cannot be null or empty");
        }

        existingProposeLocation.setDetails(request.getDetails());

        // Update the associated Location if needed
        Location location = existingProposeLocation.getLocation();
        location.setLongitude(request.getLocation().getLongitude());
        location.setLatitude(request.getLocation().getLatitude());
        location.setDistrict(request.getLocation().getDistrict());
        location.setProvince(request.getLocation().getProvince());

        locationRepository.save(location); // Save the updated Location

        return proposeLocationRepository.save(existingProposeLocation); // Save the updated ProposeLocation
    }

    @Transactional
    public OutletLocation updateOutletLocation(int outletLocationId, OutletLocation request) {
        // Check if the OutletLocation exists
        OutletLocation existingOutletLocation = outletLocationRepository.findById(outletLocationId)
                .orElseThrow(() -> new IllegalArgumentException("OutletLocation not found with ID: " + outletLocationId));

        // Update the fields with the request data
        existingOutletLocation.setOutletname(request.getOutletname());
        existingOutletLocation.setProfitStatus(request.getProfitStatus());
        existingOutletLocation.setRentPurchased(request.getRentPurchased());

        // Update the associated Location if needed
        Location location = existingOutletLocation.getLocation();
        location.setLongitude(request.getLocation().getLongitude());
        location.setLatitude(request.getLocation().getLatitude());
        location.setDistrict(request.getLocation().getDistrict());
        location.setProvince(request.getLocation().getProvince());

        locationRepository.save(location); // Save the updated Location

        return outletLocationRepository.save(existingOutletLocation); // Save the updated OutletLocation
    }


    @Transactional
    public void updateRejectApprove(int proposeId, String rejectApprove) throws Exception {
        // Find the proposal by ID
        ProposeLocation proposal = proposeLocationRepository.findById(proposeId)
                .orElseThrow(() -> new Exception("Proposal not found"));

        // Validate the rejectApprove value
        if (!"approve".equals(rejectApprove) && !"reject".equals(rejectApprove)) {
            throw new IllegalArgumentException("Invalid reject/approve status");
        }

        // Update the rejectApprove field in the proposal
        proposal.setRejectApprove(rejectApprove);

        // Save the updated proposal back to the database
        proposeLocationRepository.save(proposal);
    }

    @Transactional
    public void deleteLocation(int locationId) {
        // Delete all ProposeLocation entries associated with the given locationId
        List<ProposeLocation> proposeLocations = proposeLocationRepository.findByLocationLocationId(locationId);
        List<OutletLocation> outletLocations = outletLocationRepository.findByLocationLocationId(locationId);

        if (!proposeLocations.isEmpty()) {
            proposeLocationRepository.deleteAll(proposeLocations);
        }
        if (!outletLocations.isEmpty()) {
            outletLocationRepository.deleteAll(outletLocations);
        }

        // Now delete the Location entry
        locationRepository.deleteById(locationId);
    }
    public Location getLocationById(int locationId) {
        return locationRepository.findById(locationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with ID: " + locationId));

    }

}