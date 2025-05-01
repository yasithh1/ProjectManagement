package com.example.Suppliers.Controller;// InvoiceController.java
import com.example.Suppliers.Controller.InvoiceRequest;
import com.example.Suppliers.Model.Invoice;
import com.example.Suppliers.Service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateInvoice(@RequestBody InvoiceRequest invoiceRequest) throws Exception {
        byte[] pdfData = invoiceService.generateInvoice(
                invoiceRequest.getCustomerName(),
                invoiceRequest.getItem(),
                invoiceRequest.getQuantity(),
                invoiceRequest.getPrice()
        );

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .body(pdfData);
    }
    @GetMapping("/by-customer")
    public ResponseEntity<List<Invoice>> getInvoicesByCustomerName(@RequestParam String customerName) {
        List<Invoice> invoices = invoiceService.getInvoicesByCustomerName(customerName);
        return ResponseEntity.ok(invoices);
    }
}
