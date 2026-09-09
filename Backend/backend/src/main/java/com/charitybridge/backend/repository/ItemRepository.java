package com.charitybridge.backend.repository;

import com.charitybridge.backend.model.Item;
import com.charitybridge.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {
    
    // Find all items posted by a specific donor
    List<Item> findByDonor(User donor);
    
    // Find items by their status (e.g., to only show "AVAILABLE" items on the feed)
    List<Item> findByStatus(Item.Status status);
    
    // Find items by category and status
    List<Item> findByCategoryAndStatus(Item.Category category, Item.Status status);
    
    // Find items by status and location (donor address)
    List<Item> findByStatusAndDonorAddressContainingIgnoreCase(Item.Status status, String address);
    
    // Find items by category, status, and location
    List<Item> findByCategoryAndStatusAndDonorAddressContainingIgnoreCase(Item.Category category, Item.Status status, String address);
}