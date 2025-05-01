package com.main.ProjectManager.repository;

import com.main.ProjectManager.data.ProposeLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProposeLocationRepository extends JpaRepository<ProposeLocation, Integer> {
        // This method will return a list of ProposeLocation objects for the given proposedBy value.
        List<ProposeLocation> findByProposedBy(String proposedBy);
        @Modifying
        @Query("UPDATE ProposeLocation p SET p.rejectApprove = :rejectApprove WHERE p.proposeId = :proposeId")
        void updateRejectApprove(@Param("proposeId") int proposeId, @Param("rejectApprove") String rejectApprove);

        List<ProposeLocation> findByLocationLocationId(int locationId);



}
