package com.charitybridge.backend.controller;

import com.charitybridge.backend.dto.ClaimRequestDto;
import com.charitybridge.backend.dto.ClaimResponseDto;
import com.charitybridge.backend.service.ItemClaimService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*")
public class ItemClaimController {

    private final ItemClaimService claimService;

    public ItemClaimController(ItemClaimService claimService) {
        this.claimService = claimService;
    }

    // Receiver (NGO or INDIVIDUAL) makes a claim. We grab the Receiver ID from the custom header.
    @PostMapping
    public ResponseEntity<ClaimResponseDto> createClaim(
            @RequestBody ClaimRequestDto requestDto,
            @RequestHeader("X-User-Id") UUID receiverId) {
            
        ClaimResponseDto response = claimService.createClaim(requestDto, receiverId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ClaimResponseDto> approveClaim(@PathVariable UUID id) {
        return ResponseEntity.ok(claimService.approveClaim(id));
    }

    @PatchMapping("/{id}/fulfill")
    public ResponseEntity<ClaimResponseDto> fulfillClaim(@PathVariable UUID id) {
        return ResponseEntity.ok(claimService.fulfillClaim(id));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ClaimResponseDto>> getClaimsForItem(@PathVariable UUID itemId) {
        return ResponseEntity.ok(claimService.getClaimsForItem(itemId));
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<ClaimResponseDto>> getClaimsByReceiver(@PathVariable UUID receiverId) {
        return ResponseEntity.ok(claimService.getClaimsByReceiver(receiverId));
    }
}