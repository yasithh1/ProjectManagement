package com.main.ProjectManager.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PDFService {

    private final Path pdfStorageLocation = Paths.get("pdf-storage");

    @Autowired
    public PDFService() {
        try {
            Files.createDirectories(pdfStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create storage location for PDFs.", e);
        }
    }

    public void savePDF(MultipartFile pdf) throws IOException {
        Path targetLocation = pdfStorageLocation.resolve(pdf.getOriginalFilename());
        Files.copy(pdf.getInputStream(), targetLocation);
    }
}
