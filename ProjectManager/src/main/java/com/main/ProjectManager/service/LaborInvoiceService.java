package com.main.ProjectManager.service;

import com.main.ProjectManager.data.*;
import com.main.ProjectManager.dto.LaborWithDates;
import com.main.ProjectManager.repository.LaborInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class LaborInvoiceService {

    @Autowired
    private LaborRequestService laborRequestService;

    @Autowired
    private LaborService laborService;

    @Autowired
    private EmployeService employerService;

    @Autowired
    private LaborInvoiceRepository laborInvoiceRepository;

    @Autowired
    private TemplateEngine templateEngine;

    private Map<String, String> receiverIdMap = new HashMap<>();
    private Map<String, Integer> projectIdMap = new HashMap<>(); // New map to store project IDs

    public byte[] generateLaborInvoice(int requestId, String empId) throws IOException {
        LaborRequest laborRequest = laborRequestService.getLaborRequestById(requestId);
        String receiverId = laborRequest.getReceiver();
        int projectId = laborRequest.getProjectId();  // Retrieve projectId from LaborRequest

        // Store receiverId and projectId in maps with a unique key
        String mapKey = empId + "_" + requestId;
        receiverIdMap.put(mapKey, receiverId);
        projectIdMap.put(mapKey, projectId); // Store project ID

        // Fetch the employer's information based on their ID
        Employer employer = employerService.getEmployerById(empId);
        String employerName = employer.getFirstName() + " " + employer.getLastName();

        // Fetch the receiver's information based on their ID
        Employer receiver = employerService.getEmployerById(receiverId);
        String receiverName = receiver.getFirstName() + " " + receiver.getLastName();

        // Get the list of assigned labors for the request ID
        List<AssignLabors> assignedLabors = laborRequestService.getAllByRequestId(requestId);
        List<LaborWithDates> laborsWithDates = assignedLabors.stream()
                .map(assign -> {
                    Labors labor = laborService.getLaborById(assign.getLaborId());
                    if (labor == null) {
                        return null; // Skip if labor is null
                    }
                    int daysWorked = (assign.getDate() != null && assign.getSignOutDate() != null)
                            ? (int) ChronoUnit.DAYS.between(assign.getDate(), assign.getSignOutDate())
                            : 0;
                    int dailyCharge = (int) labor.getCharge(); // Convert to int if necessary
                    int totalCharge = daysWorked * dailyCharge;

                    // Debugging: Print out the calculation steps
                    System.out.println("Days Worked: " + daysWorked);
                    System.out.println("Daily Charge: " + dailyCharge);
                    System.out.println("Total Charge for this labor: " + totalCharge);

                    return new LaborWithDates(labor, assign.getDate(), assign.getSignOutDate(), daysWorked, dailyCharge, totalCharge);
                })
                .filter(Objects::nonNull) // Filter out null values
                .collect(Collectors.toList());

        // Calculate the overall total charge
        int totalCharge = laborsWithDates.stream()
                .mapToInt(LaborWithDates::getTotalCharge)
                .sum();

        System.out.println("Overall Total Charge: " + totalCharge);

        // Setup the context for the template
        Context context = new Context();
        context.setVariable("receiver", receiverName);
        context.setVariable("printName", employerName);
        context.setVariable("printDate", LocalDate.now().toString());
        context.setVariable("laborsWithDates", laborsWithDates);
        context.setVariable("totalCharge", totalCharge);
        context.setVariable("projectId", projectId);  // Add projectId to the context

        // Generate the HTML content for the PDF
        String htmlContent = templateEngine.process("labor-invoice-template", context);

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

        // Get the byte array of the generated PDF
        return byteArrayOutputStream.toByteArray();
    }

    public void saveLaborInvoice(byte[] pdf, String empId, String requestId, String date) {
        // Generate the unique key
        String mapKey = empId + "_" + requestId;

        // Retrieve receiverId and projectId from maps
        String receiverId = receiverIdMap.remove(mapKey);
        Integer projectId = projectIdMap.remove(mapKey); // Retrieve project ID

        if (receiverId == null || projectId == null) {
            throw new IllegalArgumentException("No receiverId or projectId found for the given empId and requestId.");
        }

        LaborInvoices laborInvoice = new LaborInvoices();
        laborInvoice.setPdf(pdf);
        laborInvoice.setEmployer(receiverId);  // Use receiverId here
        laborInvoice.setDate(date);
        laborInvoice.setProjectId(projectId);  // Save the projectId
        laborInvoiceRepository.save(laborInvoice);
    }

    // Method to get PDFs by employer
    public List<LaborInvoices> getInvoicesByEmployer(String employer) {
        return laborInvoiceRepository.findByEmployer(employer);
    }
}
