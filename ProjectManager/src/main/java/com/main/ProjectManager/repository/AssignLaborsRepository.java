package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.AssignLabors;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignLaborsRepository extends JpaRepository<AssignLabors, Integer> {
    List<AssignLabors> findAllByRequestedID(int requestedID);
    List<AssignLabors> findAllByLaborIdAndSignOutDateIsNull(String laborId);
    List<AssignLabors> findAllBySignOutDateIsNotNull();

}
