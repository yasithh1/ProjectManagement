package com.main.ProjectManager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@AllArgsConstructor
public class LocationDto {
    private int locationId;
    private double longitude;
    private double latitude;
    private String details;
    private String locationType;
    private Date date;
}
