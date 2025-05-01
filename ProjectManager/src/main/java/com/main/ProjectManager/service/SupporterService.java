package com.main.ProjectManager.service;

import com.main.ProjectManager.data.Supporter;
import com.main.ProjectManager.data.SupporterTask;
import com.main.ProjectManager.repository.SupporterRepository;
import com.main.ProjectManager.repository.SupporterTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupporterService {

    @Autowired
    private SupporterRepository supporterRepository;

    @Autowired
    private SupporterTaskRepository supporterTaskRepository;

    public Supporter createSupporter(Supporter supporter) {
        return supporterRepository.save(supporter);
    }

    public List<Supporter> getSupportersByRequestTo(String requestTo) {
        return supporterRepository.findAllByRequestTo(requestTo);
    }

    public Supporter updateSupporterStatus(String supporterId, String status) {
        Supporter supporter = supporterRepository.findById(supporterId).orElseThrow(() -> new RuntimeException("Supporter not found"));
        supporter.setStatus(status);
        return supporterRepository.save(supporter);
    }

    public List<Supporter> getSupportersByRequester (String requestBy) {
        return supporterRepository.findAllByRequestBy(requestBy);
    }

    // Method to create a new supporter task
    public SupporterTask createSupporterTask(SupporterTask supporterTask) {
        return supporterTaskRepository.save(supporterTask);
    }

    // Method to read tasks by supporter ID
    public List<SupporterTask> getTasksBySupporterId(String supporterId) {
        return supporterTaskRepository.findAllBySupporterId(supporterId);
    }

    // Method to update comment and status of a supporter task
    public SupporterTask updateCommentAndStatus(int taskId, String comment, String status) {
        Optional<SupporterTask> optionalTask = supporterTaskRepository.findById(taskId);
        if (optionalTask.isPresent()) {
            SupporterTask supporterTask = optionalTask.get();
            supporterTask.setComment(comment);
            supporterTask.setStatus(status);
            return supporterTaskRepository.save(supporterTask);
        }
        return null;
    }
}
