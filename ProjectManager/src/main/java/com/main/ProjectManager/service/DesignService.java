package com.main.ProjectManager.service;

import com.main.ProjectManager.data.Designs;
import com.main.ProjectManager.repository.data.DesignsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class DesignService {

    @Autowired
    private DesignsRepository designRepository;

    // Method to add a design
    public Designs addDesign(Designs design) throws IOException {
        // Save the design object to the database
        return designRepository.save(design);
    }

    // Method to retrieve a design by its ID
    public Optional<Designs> getDesignById(int designId) {
        return designRepository.findById(designId);
    }

    // Method to retrieve the profile picture of the design by design ID
    public byte[] getDesignImage(int designId) throws Exception {
        Optional<Designs> design = designRepository.findById(designId);
        if (design.isPresent()) {
            return design.get().getDesign();
        } else {
            throw new Exception("Design not found");
        }
    }

    // Method to retrieve all designs
    public Iterable<Designs> getAllDesigns() {
        return designRepository.findAll();
    }

    // Method to update design
    public Designs updateDesign(int designId, Designs updatedDesign) {
        Optional<Designs> designOptional = designRepository.findById(designId);

        if (designOptional.isPresent()) {
            Designs design = designOptional.get();

            // Only update fields that are included in the request
            if (updatedDesign.getStatus() != null) {
                design.setStatus(updatedDesign.getStatus());
            }

            if (updatedDesign.getUpdatedBy() != null) {
                design.setUpdatedBy(updatedDesign.getUpdatedBy());
            }

            if (updatedDesign.getDesign() != null) {
                design.setDesign(updatedDesign.getDesign());
            }

            if (updatedDesign.getUpdatedTime() != null) {
                design.setUpdatedTime(updatedDesign.getUpdatedTime());
            }

            // Save and return the updated design
            return designRepository.save(design);
        }

        // Return null if the design is not found
        return null;
    }


}
