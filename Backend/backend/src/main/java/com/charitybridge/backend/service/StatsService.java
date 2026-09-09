package com.charitybridge.backend.service;

import com.charitybridge.backend.dto.LeaderboardDto;
import com.charitybridge.backend.dto.StatsResponseDto;
import com.charitybridge.backend.model.Item;
import com.charitybridge.backend.model.User;
import com.charitybridge.backend.repository.ItemRepository;
import com.charitybridge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public StatsService(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public StatsResponseDto getGlobalStats() {
        StatsResponseDto stats = new StatsResponseDto();
        
        List<Item> allItems = itemRepository.findAll();
        
        stats.setTotalItemsDonated(allItems.size());
        
        long fulfilledItems = allItems.stream()
            .filter(i -> i.getStatus() == Item.Status.CLAIMED)
            .count();
        stats.setTotalItemsFulfilled(fulfilledItems);
        
        long ngoCount = userRepository.findByRole(User.Role.NGO).size();
        stats.setTotalActiveNGOs(ngoCount);
        
        Map<String, Long> categoryMap = allItems.stream()
            .collect(Collectors.groupingBy(
                i -> i.getCategory().name(), 
                Collectors.counting()
            ));
            
        stats.setItemsByCategory(categoryMap);
        
        return stats;
    }

    public List<LeaderboardDto> getLeaderboard() {
        // Find all donors
        List<User> donors = userRepository.findByRole(User.Role.DONOR);
        
        return donors.stream()
            .map(donor -> {
                LeaderboardDto dto = new LeaderboardDto();
                dto.setDonorId(donor.getId());
                dto.setDonorName(donor.getNameOrOrg());
                
                // Count fulfilled items for this donor
                long fulfilledCount = itemRepository.findByDonor(donor).stream()
                    .filter(i -> i.getStatus() == Item.Status.CLAIMED)
                    .count();
                
                dto.setFulfilledItemsCount(fulfilledCount);
                
                // Assign badge
                if (fulfilledCount >= 20) dto.setBadge("Philanthropist");
                else if (fulfilledCount >= 10) dto.setBadge("Gold");
                else if (fulfilledCount >= 5) dto.setBadge("Silver");
                else if (fulfilledCount >= 1) dto.setBadge("Bronze");
                else dto.setBadge("Starter");
                
                return dto;
            })
            .filter(dto -> dto.getFulfilledItemsCount() > 0) // Only show active donors
            .sorted(Comparator.comparing(LeaderboardDto::getFulfilledItemsCount).reversed())
            .limit(10) // Top 10
            .collect(Collectors.toList());
    }
}
