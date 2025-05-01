package com.main.ProjectManager.dto;

import com.main.ProjectManager.data.Labors;
import java.time.LocalDate;

public class LaborWithDates {
    private Labors labor;
    private LocalDate assignDate;
    private LocalDate signOutDate;
    private int daysWorked;
    private int dailyCharge;
    private int totalCharge;

    public LaborWithDates(Labors labor, LocalDate assignDate, LocalDate signOutDate, int daysWorked, int dailyCharge, int totalCharge) {
        this.labor = labor;
        this.assignDate = assignDate;
        this.signOutDate = signOutDate;
        this.daysWorked = daysWorked;
        this.dailyCharge = dailyCharge;
        this.totalCharge = totalCharge;
    }

    public Labors getLabor() {
        return labor;
    }

    public LocalDate getAssignDate() {
        return assignDate;
    }

    public LocalDate getSignOutDate() {
        return signOutDate;
    }

    public int getDaysWorked() {
        return daysWorked;
    }

    public int getDailyCharge() {
        return dailyCharge;
    }

    public int getTotalCharge() {
        return totalCharge;
    }
}
