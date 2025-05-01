package com.example.Suppliers.Controller;

import com.example.Suppliers.Model.UploadItem;
import com.example.Suppliers.Service.UploadItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin
public class UploadItemController {
    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private UploadItemService uploadItemService;

    @PostMapping("/api/upload")
    public ResponseEntity<?> handleFileUpload(@RequestParam("file") MultipartFile file,
                                              @RequestParam("productName") String productName,
                                              @RequestParam("quantity") int quantity,
                                              @RequestParam("category") String category) {

        try {
            // Ensure the uploads directory exists
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file to the uploads directory
            Path filePath = uploadPath.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), filePath);

            // Create and save the upload item
            UploadItem item = new UploadItem();
            item.setFileName(file.getOriginalFilename());
            item.setProductName(productName);
            item.setQuantity(quantity);
            item.setCategory(category);
            uploadItemService.saveUploadItem(item);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file");
        }
    }
}
