package com.example.Suppliers.Service;

import com.example.Suppliers.Model.Invoice;
import com.example.Suppliers.Model.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.thymeleaf.TemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.thymeleaf.context.Context;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InvoiceService {

    private final TemplateEngine templateEngine;
    private final InvoiceRepository invoiceRepository;

    @Autowired
    public InvoiceService(TemplateEngine templateEngine, InvoiceRepository invoiceRepository) {
        this.templateEngine = templateEngine;
        this.invoiceRepository = invoiceRepository;
    }

    public byte[] generateInvoice(String customerName, String item, int quantity, double price) throws IOException {
        // Create Thymeleaf context and set variables
        Context context = new Context();
        context.setVariable("customerName", customerName);
        context.setVariable("item", item);
        context.setVariable("quantity", quantity);
        context.setVariable("price", price);
        context.setVariable("total", quantity * price); // Calculating total

        // Generate the HTML content using Thymeleaf
        String htmlContent = templateEngine.process("invoice-template", context);

        // Prepare to generate the PDF
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            // Use Flying Saucer's ITextRenderer to convert HTML to PDF
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(byteArrayOutputStream);
        } catch (Exception e) {
            e.printStackTrace();  // Log the error for debugging
            throw new IOException("Error generating PDF: " + e.getMessage(), e);
        }

        // Get the generated PDF as a byte array
        byte[] pdfBytes = byteArrayOutputStream.toByteArray();

        // Save the invoice to the database
        Invoice invoice = new Invoice();
        invoice.setCustomerName(customerName);
        invoice.setItem(item);
        invoice.setQuantity(quantity);
        invoice.setPrice(price);
        invoice.setCreatedAt(LocalDateTime.now()); // Set the creation date
        invoice.setPdfData(pdfBytes); // Set the PDF data

        invoiceRepository.save(invoice);  // Save to database

        // Return the generated PDF as a byte array
        return pdfBytes;
    }
    public List<Invoice> getInvoicesByCustomerName(String customerName) {
        return invoiceRepository.findByCustomerName(customerName);
    }
}
