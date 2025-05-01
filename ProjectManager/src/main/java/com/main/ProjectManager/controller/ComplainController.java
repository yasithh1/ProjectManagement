package com.main.ProjectManager.controller;
import com.main.ProjectManager.data.Complains;
import com.main.ProjectManager.service.ComplainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api8")
public class ComplainController {

    @Autowired
    private ComplainService complainService;

    @PostMapping("/complain")
    public Complains createComplain(@RequestBody Complains complains) {
        return complainService.createComplain(complains);
    }

    @GetMapping("/complain")
    public List<Complains> getAllComplains() {
        return complainService.getAllComplains();
    }

    @GetMapping("/complain/{complainer}")
    public List<Complains> getComplainsByComplainer(@PathVariable String complainer) {
        return complainService.getComplainsByComplainer(complainer);
    }

    @PutMapping("/update-status/{id}")
    public Complains updateStatus(@PathVariable int id, @RequestParam String status, @RequestParam String viewer) {
        return complainService.updateStatus(id, status, viewer);
    }
}
