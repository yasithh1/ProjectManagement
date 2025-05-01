// Service
package com.main.ProjectManager.service;

import com.main.ProjectManager.data.DesignTask;
import com.main.ProjectManager.data.OngoingDesigns;
import com.main.ProjectManager.repository.DesignTaskRepository;
import com.main.ProjectManager.repository.OngoingDesignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OngoingDesignsService {

    @Autowired
    private OngoingDesignRepository ongoingDesignRepository;

    @Autowired
    private DesignTaskRepository designTaskRepository;

    @Transactional
    public OngoingDesigns createNewDesign(OngoingDesigns ongoingDesigns) {
        // Step 1: Save the ongoing design first
        OngoingDesigns savedOngoingDesign = ongoingDesignRepository.save(ongoingDesigns);

        // Step 2: Create a new DesignTask associated with the new ongoing design
        DesignTask designTask = new DesignTask();
        designTask.setOdesignId(savedOngoingDesign.getODesignId());
        designTask.setStatus("start");
        designTask.setDate(LocalDate.now());

        // Save the design task into the database
        DesignTask savedDesignTask = designTaskRepository.save(designTask);

        // Step 3: Update the ongoing design with the task ID (task_id)
        savedOngoingDesign.setTaskId(savedDesignTask.getDTaskId());

        // Save the updated ongoing design with the task_id
        return ongoingDesignRepository.save(savedOngoingDesign);
    }

    public List<OngoingDesigns> getDesignByDesigner(String designer) {
        return ongoingDesignRepository.findByDesigner(designer);
    }

    public List<DesignTask> getTask(int odesignId) {
        return designTaskRepository.findAllByodesignId(odesignId);
    }
    public DesignTask createTask(DesignTask designTask) {
        // Check the oDesignId value before saving
        System.out.println("oDesignId: " + designTask.getOdesignId());
        return designTaskRepository.save(designTask);
    }
    @Transactional
    public Map<String, Long> getStatusCountByDesigner(String designer) {
        // Step 1: Get all ongoing designs for the given designer
        List<OngoingDesigns> ongoingDesigns = ongoingDesignRepository.findByDesigner(designer);

        if (ongoingDesigns.isEmpty()) {
            // If no ongoing designs exist for the designer, return an empty map
            return new HashMap<>();
        }

        // Step 2: Get all oDesignIds for the ongoing designs
        List<Integer> oDesignIds = ongoingDesigns.stream()
                .map(OngoingDesigns::getODesignId)
                .collect(Collectors.toList());

        // Step 3: Fetch all tasks for the designs using the oDesignIds
        List<DesignTask> designTasks = designTaskRepository.findAllByOdesignIdIn(oDesignIds);

        // Step 4: For each oDesignId, find the latest task by date
        Map<Integer, DesignTask> latestDesignTasks = designTasks.stream()
                .filter(task -> task.getDate() != null) // Filter out tasks with null dates
                .collect(Collectors.toMap(
                        DesignTask::getOdesignId, // Key by oDesignId
                        task -> task, // Value is the task itself
                        (task1, task2) -> task1.getDate().isAfter(task2.getDate()) ? task1 : task2 // Get the latest task based on the date
                ));

        // Step 5: Count the statuses for the latest tasks
        Map<String, Long> statusCountMap = new HashMap<>();
        for (DesignTask task : latestDesignTasks.values()) {
            String status = task.getStatus();
            // Increase count for each status, including "hold"
            statusCountMap.put(status, statusCountMap.getOrDefault(status, 0L) + 1);
        }

        // Step 6: Add a count for all designs
        statusCountMap.put("allDesigns", (long) ongoingDesigns.size());

        // Add a "hold" status count if it doesn't exist in the map, to ensure it shows up even with zero occurrences
        statusCountMap.putIfAbsent("hold", 0L);

        return statusCountMap;
    }


    public void updateStatusAndUploadImage(int oDesignId, String status, MultipartFile file) throws IOException {
        Optional<OngoingDesigns> optionalTask = ongoingDesignRepository.findById(oDesignId);
        if (optionalTask.isPresent()) {
            OngoingDesigns task = optionalTask.get();
            task.setStatus(status);
            if (file != null && !file.isEmpty()) {
                task.setDesign(file.getBytes());
            }
            ongoingDesignRepository.save(task);
        } else {
            throw new RuntimeException("Task not found with ID: " + oDesignId);
        }
    }
    public List<OngoingDesigns> getAllForApproval() {
        return ongoingDesignRepository.findByStatus("for approval");
    }
    public List<OngoingDesigns> getAllApproved() {
        return ongoingDesignRepository.findByStatus("approved");
    }
}
