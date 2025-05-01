package com.main.ProjectManager.service;

import com.main.ProjectManager.repository.EmployeRepository;
import com.main.ProjectManager.data.Employer;
import com.main.ProjectManager.dto.EmployerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeService {
    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private JavaMailSender mailSender;

    private static final int ID_PADDING_LENGTH = 4;
    private static final int PASSWORD_LENGTH = 8;

    public Employer createEmployer(Employer employer) {
        // Generate empId and password
        String empId = generateEmpId();
        String password = generatePassword();
        employer.setEmpId(empId);
        employer.setPassword(password);

        // Save employer to database
        Employer savedEmployer = employeRepository.save(employer);

        // Send welcome email
        sendWelcomeEmail(savedEmployer, password);

        return savedEmployer;
    }

    private String generateEmpId() {
        List<Employer> employers = employeRepository.findAll();
        if (employers.isEmpty()) {
            return "EMP" + String.format("%04d", 1);
        } else {
            String lastEmpId = employers.get(employers.size() - 1).getEmpId();
            int idNumber = Integer.parseInt(lastEmpId.substring(3)) + 1;
            return "EMP" + String.format("%04d", idNumber);
        }
    }

    private String generatePassword() {
        String charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            password.append(charSet.charAt(random.nextInt(charSet.length())));
        }
        return password.toString();
    }

    private void sendWelcomeEmail(Employer employer, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(employer.getEmail());
        message.setSubject("Welcome to the Company!");
        message.setText("Dear " + employer.getFirstName() + " " + employer.getLastName() + ",\n\n" +
                "Welcome to the company! Your account has been successfully created.\n\n" +
                "Here are your login credentials:\n" +
                "Employee ID: " + employer.getEmpId() + "\n" +
                "Type: " + employer.getPosition()+"\n"+
                "Email: " + employer.getEmail()+"\n"+
                "Password: " + password + "\n\n" +
                "Please keep this information secure and do not share it with anyone.\n" +
                "You can log in to the system to update your profile or change your password.\n\n" +
                "Best Regards,\nAdmin Team");

        mailSender.send(message);
    }

    public List<Employer> getAllEmployers() {
        return employeRepository.findAll();
    }

    public Employer getEmployerByEmail(String email) {
        return employeRepository.findByEmail(email).orElse(null);
    }

    public void updatePassword(String email, String newPassword) {
        Employer employer = getEmployerByEmail(email);
        if (employer != null) {
            employer.setPassword(newPassword);
            employeRepository.save(employer);
        }
    }

    public EmployerDTO login(String email, String password) {
        Employer employer = employeRepository.findByEmail(email).orElse(null);

        if (employer != null && employer.getPassword().equals(password)) {
            return new EmployerDTO(
                    employer.getEmpId(),
                    employer.getFirstName(),
                    employer.getLastName(),
                    employer.getProfilePic(),
                    employer.getPosition(),
                    employer.getAddress(),
                    employer.getPhoneNumber()
            );
        }
        return null;
    }

    public void retriveEmploye(String empId, String firstName, String lastName, String position) {
    }

    public Employer updateProfilePicture(String empId, MultipartFile file) throws IOException {
        Optional<Employer> employerOpt = employeRepository.findById(empId);
        if (employerOpt.isPresent()) {
            Employer employer = employerOpt.get();
            employer.setProfilePic(file.getBytes());
            return employeRepository.save(employer);
        }
        return null;
    }

    // Method to update other details of an employer
    public Employer updateEmployerDetails(String empId, String firstName, String lastName, String position) {
        Optional<Employer> employerOpt = employeRepository.findById(empId);
        if (employerOpt.isPresent()) {
            Employer employer = employerOpt.get();
            employer.setFirstName(firstName);
            employer.setLastName(lastName);
            employer.setPosition(position);
            return employeRepository.save(employer);
        }
        return null;
    }

    public EmployerDTO getEmployerNameById(String empId) {
        Optional<Employer> employerOpt = employeRepository.findById(empId);
        if (employerOpt.isPresent()) {
            Employer employer = employerOpt.get();
            // Use the simplified constructor
            return new EmployerDTO(employer.getEmpId(), employer.getFirstName(), employer.getLastName());
        }
        return null; // Handle the case where the employer is not found
    }

    // Method to get employer by employee ID
    public Employer getEmployerById(String empId) {
        return employeRepository.findById(empId).orElse(null);
    }

    // Method to search employers by keyword
    public List<EmployerDTO> searchEmployers(String keyword) {
        List<Employer> employers = employeRepository.searchEmployers(keyword);

        // Map Employer entities to DTOs
        return employers.stream()
                .map(employer -> new EmployerDTO(
                        employer.getEmpId(),
                        employer.getFirstName() + " " + employer.getLastName(),
                        employer.getPosition()
                ))
                .toList();
    }
}
