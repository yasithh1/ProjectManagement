package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer> {
    // Custom query to find meetings by receiver
    List<Meeting> findByReceiver(String receiver);
}
