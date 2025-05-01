package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.Complains;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplainRepository extends JpaRepository<Complains, Integer> {
    List<Complains> findByComplainer(String complainer);
}
