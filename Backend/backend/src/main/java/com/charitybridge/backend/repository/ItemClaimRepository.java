package com.charitybridge.backend.repository;

import com.charitybridge.backend.model.Item;
import com.charitybridge.backend.model.ItemClaim;
import com.charitybridge.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItemClaimRepository extends JpaRepository<ItemClaim, UUID> {
    
    // See all claims made by a specific receiver (NGO or INDIVIDUAL)
    List<ItemClaim> findByReceiver(User receiver);
    
    // See all claims made on a specific item (for the donor to review)
    List<ItemClaim> findByItem(Item item);
}