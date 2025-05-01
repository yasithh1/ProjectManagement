package com.main.ProjectManager.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Setter
@Getter
@Entity
@Table(name = "meetings")
public class Meeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private int meetingId;

    @Column(name = "meeting_type")
    private String meetingType;

    @Column(name = "date")
    private java.util.Date date;

    @Column(name = "venue")
    private String venue;

    @Column(name = "receiver")
    private String receiver;

    @Column(name = "time")
    private LocalTime time;


}
