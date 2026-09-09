package com.charitybridge.backend.controller;

import com.charitybridge.backend.dto.ItemRequestDto;
import com.charitybridge.backend.dto.ItemResponseDto;
import com.charitybridge.backend.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // Creates an item. Notice we grab the donor ID from the custom header.
    @PostMapping
    public ResponseEntity<ItemResponseDto> createItem(
            @RequestBody ItemRequestDto requestDto,
            @RequestHeader("X-User-Id") UUID donorId) {
        
        ItemResponseDto response = itemService.createItem(requestDto, donorId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ItemResponseDto>> getAllAvailableItems(
            @RequestParam(required = false) com.charitybridge.backend.model.Item.Category category,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(itemService.getAllAvailableItems(category, location));
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<ItemResponseDto>> getDonorItems(@PathVariable java.util.UUID donorId) {
        return ResponseEntity.ok(itemService.getItemsByDonor(donorId));
    }
}