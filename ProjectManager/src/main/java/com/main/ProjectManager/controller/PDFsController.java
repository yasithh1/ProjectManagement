package com.main.ProjectManager.controller;


import com.main.ProjectManager.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class PDFsController {

    @Autowired
    private PDFService pdfService;

    @PostMapping("/save-pdf")
    public ResponseEntity<String> savePDF(@RequestParam("pdf") MultipartFile pdf) {
        try {
            pdfService.savePDF(pdf);
            return ResponseEntity.ok("PDF saved successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving PDF");
        }
    }
}
