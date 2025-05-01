package com.main.ProjectManager.service;

import com.main.ProjectManager.data.Request;
import com.main.ProjectManager.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    // Create a new request
    public Request createRequest(Request request) {
        return requestRepository.save(request);
    }

    // Get requests by supplier email
    public List<Request> getRequestsBySupplierEmail(String supplierEmail) {
        return requestRepository.findBysupplierEmail(supplierEmail);
    }

    public Request changeRequestStatus(Long id, String status)
    { Optional<Request> requestOptional = requestRepository.findById(id);
        if (requestOptional.isPresent()) { Request request = requestOptional.get();
            request.setStatus(status); return requestRepository.save(request); }
    else { throw new RuntimeException("Request not found with id: " + id); } }


     public List<Request> getRequestsByEmpId(String empId)
     { return requestRepository.findByempId(empId); }
}
