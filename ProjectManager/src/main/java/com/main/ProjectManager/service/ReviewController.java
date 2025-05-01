package com.main.ProjectManager.controller;

import com.main.ProjectManager.dto.ReviewDTO;
import com.main.ProjectManager.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> sendReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            reviewService.sendReviewToSupplierMicroservice(reviewDTO);
            return new ResponseEntity<>("Review submitted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to submit review", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
