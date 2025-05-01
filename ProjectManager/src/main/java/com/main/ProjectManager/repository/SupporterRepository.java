package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Supporter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupporterRepository extends JpaRepository<Supporter, String> {
    List<Supporter> findAllByRequestTo(String requestTo);
    List<Supporter> findAllByRequestBy(String requestBy);
}
