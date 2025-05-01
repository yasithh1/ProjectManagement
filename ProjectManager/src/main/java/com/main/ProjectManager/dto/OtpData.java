package com.main.ProjectManager.dto;

public class OtpData {

    private String otp;
    private long timestamp;

    public OtpData(String otp, long timestamp) {
        this.otp = otp;
        this.timestamp = timestamp;
    }

    public String getOtp() {
        return otp;
    }

    public long getTimestamp() {
        return timestamp;
    }


}
