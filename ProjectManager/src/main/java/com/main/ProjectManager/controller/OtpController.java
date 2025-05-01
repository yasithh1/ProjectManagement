package com.main.ProjectManager.controller;

import com.main.ProjectManager.service.EmployeService;
import com.main.ProjectManager.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmployeService employeService;

    // Send OTP endpoint
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String response = otpService.generateOtp(email);
        return ResponseEntity.ok(response);
    }

    // Verify OTP endpoint
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        boolean isValid = otpService.verifyOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok("OTP verified successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid OTP.");
        }
    }

    // Change password endpoint
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (otpService.isOtpVerified(email)) {
            employeService.updatePassword(email, newPassword);
            otpService.clearOtpStatus(email);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "OTP not verified!"));
        }
    }
}
