package com.main.ProjectManager.service;

import com.main.ProjectManager.repository.ContractRepository;
import com.main.ProjectManager.data.Contracts;
import com.main.ProjectManager.data.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;
    private LocationService locationService;

    public Contracts createContract (Contracts contracts){return contractRepository.save(contracts); }
    public List<Contracts> getAllContracts (){return contractRepository.findAll();}
    public Contracts getContractById(int contractId) {
        return contractRepository.findById(contractId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + contractId));
    }

    @Transactional
    public void updateContractStatus(int contractId, String status) throws Exception {
        // Find the contract by ID
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new Exception("Contract not found"));

        // Validate the status value (Optional, add your own validation logic here)
        if (!"assigned".equals(status) && !"canceled".equals(status)) {
            throw new IllegalArgumentException("Invalid contract status");
        }

        // Update the status field in the contract
        contract.setStatus(status);

        // Save the updated contract back to the database
        contractRepository.save(contract);
    }

    public Location getLocationDetailsByContractId(int contractId) {
        // Step 1: Fetch the contract by contractId
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Contract not found with ID: " + contractId
                ));

        // Step 2: Extract the locationId from the contract
        int locationId = contract.getLocationId();
        System.out.println("Retrieved locationId: " + locationId);  // Log to verify locationId

        // Step 3: Fetch location details using locationId
        // This assumes getLocationById directly returns a Location object
        return locationService.getLocationById(locationId);
    }




}
