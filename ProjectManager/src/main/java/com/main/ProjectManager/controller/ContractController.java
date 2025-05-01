package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Contracts;
import com.main.ProjectManager.data.Location;
import com.main.ProjectManager.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api4")
public class ContractController {

    @Autowired
    private ContractService contractService;

    // Create a new contract
    @PostMapping("/contract")
    public ResponseEntity<Contracts> createContract(@RequestBody Contracts contract) {
        Contracts createdContract = contractService.createContract(contract);
        return ResponseEntity.ok(createdContract);
    }

    // Get all contracts
    @GetMapping("/contract")
    public ResponseEntity<List<Contracts>> getAllContracts() {
        List<Contracts> contracts = contractService.getAllContracts();
        return ResponseEntity.ok(contracts);
    }

    // Get a contract by ID
    @GetMapping("/{id}")
    public ResponseEntity<Contracts> getContractById(@PathVariable int id) {
        Contracts contract = contractService.getContractById(id);
        return ResponseEntity.ok(contract);
    }

    @PutMapping("/{contractId}/status")
    public ResponseEntity<String> updateContractStatus(
            @PathVariable int contractId,
            @RequestParam String status) {
        try {
            // Call the service method to update the contract status
            contractService.updateContractStatus(contractId, status);

            // Return success response
            return ResponseEntity.ok("Contract status updated successfully to " + status);
        } catch (Exception e) {
            // Handle exception and return error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/{contractId}/location/find")
    public ResponseEntity<Location> getLocationByContractId(@PathVariable int contractId) {
        Location location = contractService.getLocationDetailsByContractId(contractId);
        return ResponseEntity.ok(location);
    }


}









