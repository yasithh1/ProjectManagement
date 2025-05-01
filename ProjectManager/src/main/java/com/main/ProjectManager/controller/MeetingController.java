package com.main.ProjectManager.controller;

import com.main.ProjectManager.data.Meeting;
import com.main.ProjectManager.service.MeetingSerivce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api5")
public class MeetingController {

    @Autowired
    private MeetingSerivce meetingSerivce;

    @PostMapping("/meeting")
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        Meeting createdMeeting = meetingSerivce.createMeeting(meeting);
        return ResponseEntity.ok(createdMeeting);
    }

    // Get all meetings
    @GetMapping("/meetings")
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        List<Meeting> meetings = meetingSerivce.getAllMeetings();
        return ResponseEntity.ok(meetings);
    }

    // Get meetings by receiver
    @GetMapping("/receiver/{receiver}")
    public ResponseEntity<List<Meeting>> getMeetingsByReceiver(@PathVariable String receiver) {
        List<Meeting> meetings = meetingSerivce.getMeetingsByReceiver(receiver);
        return ResponseEntity.ok(meetings);
    }
}
