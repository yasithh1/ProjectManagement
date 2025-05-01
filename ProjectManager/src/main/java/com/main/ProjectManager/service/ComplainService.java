package com.main.ProjectManager.service;


import com.main.ProjectManager.data.Complains;
import com.main.ProjectManager.repository.ComplainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplainService {

    @Autowired
    private ComplainRepository complainRepository;

    public Complains createComplain(Complains complains) {
        return complainRepository.save(complains);
    }

    public List<Complains> getAllComplains() {
        return complainRepository.findAll();
    }

    public List<Complains> getComplainsByComplainer(String complainer) {
        return complainRepository.findByComplainer(complainer);
    }

    public Complains updateStatus(int complainId, String status,String viewer) {
        Complains complain = complainRepository.findById(complainId).orElseThrow(() -> new RuntimeException("Complain not found"));
        complain.setStatus(status);
        complain.setViewer(viewer);
        return complainRepository.save(complain);
    }
}
