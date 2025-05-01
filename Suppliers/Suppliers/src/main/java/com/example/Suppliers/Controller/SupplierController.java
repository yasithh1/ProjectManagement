package com.example.Suppliers.Controller;

import com.example.Suppliers.Model.Request; // Import the local representation
import com.example.Suppliers.Model.Supplier;
import com.example.Suppliers.Service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;

import java.util.List;

@RestController
@RequestMapping("/api/supplier")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private RestTemplate restTemplate;

    private static final String REQUEST_SERVICE_URL = "http://localhost:8081/api";

    @PostMapping("/auth/signup")
    public ResponseEntity<Supplier> addSupplier(@RequestBody Supplier supplier) {
        Supplier newSupplier = supplierService.addSupplier(supplier);
        return ResponseEntity.ok(newSupplier);
    }

    @PostMapping("/auth/signin")
    public ResponseEntity<?> authenticateSupplier(@RequestBody LoginRquest request) {
        Supplier authenticatedSupplier = supplierService.authenticateSupplier(request.getEmail(), request.getPassword());
        if (authenticatedSupplier != null) {
            LoginResponse response = new LoginResponse(
                    authenticatedSupplier.getId(),
                    authenticatedSupplier.getFirstName(),
                    authenticatedSupplier.getLastName(),
                    authenticatedSupplier.getEmail(),
                    authenticatedSupplier.getBusinessName(),
                    authenticatedSupplier.getTelephone(),
                    authenticatedSupplier.getPhoneNumber(),
                    authenticatedSupplier.getAddress()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("{\"message\": \"Invalid email or password\"}");
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Integer id, @RequestBody LoginResponse updateRequest) {
        Supplier updatedSupplier = supplierService.updateSupplier(id, updateRequest);
        return ResponseEntity.ok(updatedSupplier);
    }

    @GetMapping("/suppliers")
    public List<Supplier> getSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @PostMapping("/sendRequest")
    public ResponseEntity<?> sendRequest(@RequestBody Request request) {
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(REQUEST_SERVICE_URL + "/contactSupplier", request, String.class);
            return ResponseEntity.ok().body("Request sent successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred while sending the request: " + e.getMessage());
        }
    }

    @GetMapping("/requests/{supplierEmail}")
    public ResponseEntity<String> getRequestsForSupplier(@PathVariable String supplierEmail) {
        try {
            ResponseEntity<List<Request>> response = restTemplate.exchange(
                    REQUEST_SERVICE_URL + "/supplier/" + supplierEmail,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Request>>() {}
            );
            return ResponseEntity.ok().body(response.getBody().toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred while fetching the requests: " + e.getMessage());
        }
    }


 @GetMapping("/search/{productCategory}")
 public ResponseEntity<List<Supplier>> searchSuppliersByProductCategory(@PathVariable String productCategory)
 { List<Supplier> suppliers = supplierService.findSuppliersByProductCategory(productCategory);
     return ResponseEntity.ok(suppliers); }
}
