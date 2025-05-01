package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.LaborInvoices;
import com.main.ProjectManager.service.LaborInvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/labor-invoice")
public class LaborInvoiceController {

    @Autowired
    private LaborInvoiceService laborInvoiceService;

    @GetMapping("/{requestId}/generate")
    public ResponseEntity<byte[]> generateLaborInvoice(@PathVariable int requestId, @RequestParam String empId) {
        try {
            byte[] pdfBytes = laborInvoiceService.generateLaborInvoice(requestId, empId);
            return ResponseEntity.ok().header("Content-Type", "application/pdf").body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/save")
    public ResponseEntity<Void> saveLaborInvoice(@RequestParam("pdf") MultipartFile pdf,
                                                 @RequestParam("requestId") String requestId,
                                                 @RequestParam("empId") String empId) {
        try {
            laborInvoiceService.saveLaborInvoice(pdf.getBytes(), empId, requestId, LocalDate.now().toString());
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/invoices/{employer}")
    public ResponseEntity<List<LaborInvoices>> getInvoicesByEmployer(@PathVariable String employer) {
        List<LaborInvoices> invoices = laborInvoiceService.getInvoicesByEmployer(employer);
        return ResponseEntity.ok(invoices);
    }
}
