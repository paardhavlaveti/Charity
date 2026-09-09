package com.charitybridge.backend.service;

import com.charitybridge.backend.dto.ItemRequestDto;
import com.charitybridge.backend.dto.ItemResponseDto;
import com.charitybridge.backend.model.Item;
import com.charitybridge.backend.model.User;
import com.charitybridge.backend.repository.ItemRepository;
import com.charitybridge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    // Constructor injection is best practice
    public ItemService(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public ItemResponseDto createItem(ItemRequestDto requestDto, UUID donorId) {
        // 1. Fetch the donor
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        // 2. Map DTO to Entity
        Item item = new Item();
        item.setTitle(requestDto.getTitle());
        item.setDescription(requestDto.getDescription());
        item.setQuantity(requestDto.getQuantity());
        item.setCategory(requestDto.getCategory());
        item.setImageUrl(requestDto.getImageUrl());
        item.setLatitude(requestDto.getLatitude());
        item.setLongitude(requestDto.getLongitude());
        item.setDonor(donor);
        item.setStatus(Item.Status.AVAILABLE);

        // 3. Save to database
        Item savedItem = itemRepository.save(item);

        // 4. Return mapped Response DTO
        return mapToResponseDto(savedItem);
    }

    public List<ItemResponseDto> getAllAvailableItems(Item.Category category, String location) {
        List<Item> items;
        
        if (category != null && location != null && !location.trim().isEmpty()) {
            items = itemRepository.findByCategoryAndStatusAndDonorAddressContainingIgnoreCase(category, Item.Status.AVAILABLE, location.trim());
        } else if (category != null) {
            items = itemRepository.findByCategoryAndStatus(category, Item.Status.AVAILABLE);
        } else if (location != null && !location.trim().isEmpty()) {
            items = itemRepository.findByStatusAndDonorAddressContainingIgnoreCase(Item.Status.AVAILABLE, location.trim());
        } else {
            items = itemRepository.findByStatus(Item.Status.AVAILABLE);
        }
        
        return items.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<ItemResponseDto> getItemsByDonor(UUID donorId) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        
        List<Item> items = itemRepository.findByDonor(donor);
        return items.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    // Helper method to convert Entity to DTO
    private ItemResponseDto mapToResponseDto(Item item) {
        ItemResponseDto dto = new ItemResponseDto();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setQuantity(item.getQuantity());
        dto.setCategory(item.getCategory());
        dto.setImageUrl(item.getImageUrl());
        dto.setStatus(item.getStatus());
        dto.setLatitude(item.getLatitude());
        dto.setLongitude(item.getLongitude());
        
        // Safely extract donor info
        if (item.getDonor() != null) {
            dto.setDonorName(item.getDonor().getNameOrOrg());
            dto.setDonorCity(item.getDonor().getAddress()); 
        }
        
        return dto;
    }
}