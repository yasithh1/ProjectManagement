package com.main.ProjectManager.service;

import com.main.ProjectManager.data.Employer;
import com.main.ProjectManager.data.Labors;
import com.main.ProjectManager.repository.LaborRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LaborService {

    @Autowired
    private LaborRepository laborRepository;

    public Labors createLabor(Labors labor) {
        return laborRepository.save(labor);
    }

    public Labors getLaborByLaborId(String laborId) {
        return laborRepository.findByLaborId(laborId).orElse(null);
    }

    public List<Labors> getAllLabors() {
        return laborRepository.findAll();
    }

    public void removeLaborById(String laborId) {
        laborRepository.deleteById(laborId);
    }

    // Update labor details by labor Id
    public Labors updateLabor(String laborId, Labors updatedLabor) {
        Optional<Labors> existingLaborOpt = laborRepository.findById(laborId);
        if (existingLaborOpt.isPresent()) {
            Labors existingLabor = existingLaborOpt.get();

            existingLabor.setName(updatedLabor.getName());
            existingLabor.setLaborId(updatedLabor.getLaborId());
            existingLabor.setType(updatedLabor.getType());
            existingLabor.setPhone(updatedLabor.getPhone());
            existingLabor.setCharge(updatedLabor.getCharge());

            return laborRepository.save(existingLabor);
        }
        return null;
    }

    public Labors getLaborById(String laborId) {
        return laborRepository.findById(laborId).orElse(null);
    }
}
