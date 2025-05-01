package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.LaborRequest;
import com.main.ProjectManager.service.LaborReportService;
import com.main.ProjectManager.service.LaborRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@RequestMapping("/api/labor-report")
public class LaborReportController {

    @Autowired
    private LaborRequestService laborRequestService;

    @Autowired
    private LaborReportService laborReportService;

    // Endpoint to fetch labor request details by request ID
    @GetMapping("/{requestId}")
    public ResponseEntity<LaborRequest> getLaborRequest(@PathVariable int requestId) {
        LaborRequest laborRequest = laborRequestService.getLaborRequestById(requestId);
        if (laborRequest != null) {
            return ResponseEntity.ok(laborRequest);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to generate the labor report
    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateLaborReport(@RequestParam int requestId) {
        try {
            byte[] pdfBytes = laborReportService.generateLaborReport(requestId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "labor-report.pdf");
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
}
