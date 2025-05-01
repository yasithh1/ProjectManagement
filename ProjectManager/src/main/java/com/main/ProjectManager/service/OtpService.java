package com.main.ProjectManager.service;

import com.main.ProjectManager.dto.OtpData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, OtpData> otpStorage = new HashMap<>();
    private final Map<String, Boolean> otpVerifiedStatus = new HashMap<>();

    private static final long OTP_EXPIRY_DURATION = 1 * 60 * 1000; // 1 minute

    // Generate and send OTP
    public String generateOtp(String email) {
        String otp = String.format("%04d", new Random().nextInt(10000)); // 4-digit OTP
        long timestamp = System.currentTimeMillis();

        otpStorage.put(email, new OtpData(otp, timestamp));
        sendOtpEmail(email, otp);

        return otp;
    }

    // Send OTP email
    private void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp + ". It will expire in 1 minute.");
        mailSender.send(message);
    }

    // Verify OTP
    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return false; // OTP not found
        }

        long currentTime = System.currentTimeMillis();
        if (currentTime - otpData.getTimestamp() > OTP_EXPIRY_DURATION) {
            otpStorage.remove(email);
            return false; // OTP expired
        }

        boolean isValid = otp.equals(otpData.getOtp());
        if (isValid) {
            otpVerifiedStatus.put(email, true); // Mark as verified
            otpStorage.remove(email); // Clear OTP after verification
        }
        return isValid;
    }

    // Check OTP verification status
    public boolean isOtpVerified(String email) {
        return otpVerifiedStatus.getOrDefault(email, false);
    }

    // Clear OTP verification status
    public void clearOtpStatus(String email) {
        otpVerifiedStatus.remove(email);
    }

    // Clean expired OTPs every 30 seconds
    @Scheduled(fixedRate = 30 * 1000)
    public void cleanExpiredOtps() {
        long currentTime = System.currentTimeMillis();
        Iterator<Map.Entry<String, OtpData>> iterator = otpStorage.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry<String, OtpData> entry = iterator.next();
            OtpData otpData = entry.getValue();

            if (currentTime - otpData.getTimestamp() > OTP_EXPIRY_DURATION) {
                iterator.remove();
            }
        }
    }
}
