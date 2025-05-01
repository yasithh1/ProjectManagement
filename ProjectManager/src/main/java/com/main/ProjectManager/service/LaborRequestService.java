package com.main.ProjectManager.service;

import com.main.ProjectManager.data.AssignLabors;
import com.main.ProjectManager.data.LaborRequest;
import com.main.ProjectManager.data.Labors;
import com.main.ProjectManager.data.RequestedLabors;
import com.main.ProjectManager.repository.AssignLaborsRepository;
import com.main.ProjectManager.repository.LaborRequestRepository;
import com.main.ProjectManager.repository.RequestedLaborsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class LaborRequestService {

    @Autowired
    private LaborRequestRepository laborRequestRepository;

    @Autowired
    private RequestedLaborsRepository requestedLaborsRepository;

    @Autowired
    private AssignLaborsRepository assignLaborsRepository;

    public LaborRequest createLaborRequest(int projectId, String receiver) {
        LaborRequest laborRequest = new LaborRequest();
        laborRequest.setProjectId(projectId);
        laborRequest.setReceiver(receiver);
        laborRequest.setStatus("Pending");
        laborRequest.setDate(LocalDate.now());
        return laborRequestRepository.save(laborRequest);
    }

    public void createRequestedLabors(Integer requestId, List<RequestedLabors> labors) {
        for (RequestedLabors labor : labors) {
            labor.setRequestId(requestId);
            requestedLaborsRepository.save(labor);
        }
    }

    public List<LaborRequest> getAllRequests() {
        return laborRequestRepository.findAll();
    }

    public AssignLabors createAssign(AssignLabors assignLabors) {
        return assignLaborsRepository.save(assignLabors);
    }

    public List<AssignLabors> getAllByRequestId(int requestId) {
        return assignLaborsRepository.findAllByRequestedID(requestId);
    }

    public void updateSignOutDate(int inputId, LocalDate signOutDate) {
        Optional<AssignLabors> assignLaborOpt = assignLaborsRepository.findById(inputId);
        if (assignLaborOpt.isPresent()) {
            AssignLabors assignLabor = assignLaborOpt.get();
            assignLabor.setSignOutDate(signOutDate);
            assignLaborsRepository.save(assignLabor);
        }
    }

    public LaborRequest getLaborRequestById(int requestId) {
        return laborRequestRepository.findById(requestId).orElse(null);
    }

    public boolean isLaborAssignedAndNotSignedOut(String laborId) {
        List<AssignLabors> assignedLabors = assignLaborsRepository.findAllByLaborIdAndSignOutDateIsNull(laborId);
        return !assignedLabors.isEmpty();
    }



    public void updatePayStatus(int assignId) {
        Optional<AssignLabors> assignLaborOpt = assignLaborsRepository.findById(assignId);
        if (assignLaborOpt.isPresent()) {
            AssignLabors assignLabor = assignLaborOpt.get();
            assignLabor.setPayStatus(LocalDate.now());
            assignLaborsRepository.save(assignLabor);
        }
    }
    public List<AssignLabors> getAllLaborsWithSignOut() {
        return assignLaborsRepository.findAllBySignOutDateIsNotNull();
    }
}
