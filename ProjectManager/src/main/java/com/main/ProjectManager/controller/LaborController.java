package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Employer;
import com.main.ProjectManager.data.Labors;
import com.main.ProjectManager.service.LaborService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api2")
public class LaborController {
    @Autowired
    private LaborService laborService;

    //APi for create/insert labor
    @PostMapping(path = "/labor")
    public Labors createLabor(@RequestBody Labors labor) {return laborService.createLabor(labor);}

    //Api for get all labors
    @GetMapping(path = "/labor")
    public List<Labors> getAllLabors(){return laborService.getAllLabors();}

    //Api for delete labor by id
    @DeleteMapping(path = "/{laborId}")
    public void deleteLabor(@PathVariable String laborId){laborService.removeLaborById(laborId);}

    //Api for update labor by id
    @PutMapping(path = "/{laborId}")
    public Labors updateLabor(@PathVariable String laborId, @RequestBody Labors updatedLabor){
        return laborService.updateLabor(laborId, updatedLabor);
    }

    @GetMapping("/{laborId}")
    public ResponseEntity<Labors> getLaborById(@PathVariable String laborId) {
        Labors labors = laborService.getLaborByLaborId(laborId);
        if (labors != null) {
            return ResponseEntity.ok(labors);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
