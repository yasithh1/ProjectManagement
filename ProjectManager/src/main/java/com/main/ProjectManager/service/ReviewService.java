package com.main.ProjectManager.service;

import com.main.ProjectManager.dto.ReviewDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ReviewService {

    private final RestTemplate restTemplate;

    @Autowired
    public ReviewService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendReviewToSupplierMicroservice(ReviewDTO reviewDTO) {
        String supplierMicroserviceUrl = "http://localhost:8081/api/reviews";  // Update this with the correct URL
        restTemplate.postForObject(supplierMicroserviceUrl, reviewDTO, ReviewDTO.class);
    }
}
