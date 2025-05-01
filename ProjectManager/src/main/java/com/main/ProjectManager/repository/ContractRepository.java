package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Contracts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository <Contracts, Integer>{
}
