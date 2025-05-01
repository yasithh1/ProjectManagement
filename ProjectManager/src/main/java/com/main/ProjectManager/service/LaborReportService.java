package com.main.ProjectManager.service;

import com.main.ProjectManager.data.AssignLabors;
import com.main.ProjectManager.data.LaborRequest;
import com.main.ProjectManager.data.Labors;
import com.main.ProjectManager.repository.AssignLaborsRepository;
import com.main.ProjectManager.repository.LaborRepository;
import com.main.ProjectManager.repository.LaborRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class LaborReportService {

    private static final Logger logger = Logger.getLogger(LaborReportService.class.getName());

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private LaborRepository laborRepository;

    @Autowired
    private AssignLaborsRepository assignLaborsRepository;

    @Autowired
    private LaborRequestRepository laborRequestRepository;

    // Method to generate labor report
    public byte[] generateLaborReport(int requestId) throws IOException {
        // Fetch labor request details
        LaborRequest laborRequest = laborRequestRepository.findById(requestId).orElse(null);
        if (laborRequest == null) {
            throw new IllegalArgumentException("Invalid request ID");
        }

        // Fetch all assigned labors by request ID
        logger.info("Fetching assigned labors for request ID: " + requestId);
        List<AssignLabors> assignedLabors = assignLaborsRepository.findAllByRequestedID(requestId);

        if (assignedLabors.isEmpty()) {
            logger.warning("No assigned labors found for request ID: " + requestId);
        } else {
            logger.info("Found assigned labors: " + assignedLabors.size());
        }

        // Fetch labor details for each assigned labor
        List<Labors> labors = laborRepository.findAllById(
                assignedLabors.stream().map(AssignLabors::getLaborId).collect(Collectors.toList())
        );

        if (labors.isEmpty()) {
            logger.warning("No labor details found for the assigned labors.");
        } else {
            logger.info("Found labor details: " + labors.size());
        }

        // Prepare context for the template
        Context context = new Context();
        context.setVariable("printDate", LocalDate.now().format(DateTimeFormatter.ISO_DATE));
        context.setVariable("requestId", requestId);
        context.setVariable("receiver", laborRequest.getReceiver());
        context.setVariable("date", laborRequest.getDate());
        context.setVariable("labors", labors);
        context.setVariable("message", labors.isEmpty() ? "Not enough data" : null);

        // Generate the HTML content for the PDF
        String htmlContent = templateEngine.process("labor-report-template", context);

        // Create the PDF from the HTML content
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(byteArrayOutputStream);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Error generating PDF: " + e.getMessage(), e);
        }

        return byteArrayOutputStream.toByteArray();
    }
}
