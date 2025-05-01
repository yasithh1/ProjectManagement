package com.main.ProjectManager.service;

import com.main.ProjectManager.data.Meeting;
import com.main.ProjectManager.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class MeetingSerivce {

    @Autowired
    private MeetingRepository meetingRepository;

    // Method to create a new meeting
    public Meeting createMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    // Get all meetings
    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    // Get meetings by receiver (assumed to be position)
    public List<Meeting> getMeetingsByReceiver(String receiver) {
        return meetingRepository.findByReceiver(receiver);
    }
}
