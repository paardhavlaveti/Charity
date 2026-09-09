package com.charitybridge.backend.service;

import com.charitybridge.backend.dto.ClaimRequestDto;
import com.charitybridge.backend.dto.ClaimResponseDto;
import com.charitybridge.backend.model.Item;
import com.charitybridge.backend.model.ItemClaim;
import com.charitybridge.backend.model.User;
import com.charitybridge.backend.repository.ItemClaimRepository;
import com.charitybridge.backend.repository.ItemRepository;
import com.charitybridge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ItemClaimService {

    private final ItemClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemClaimService(ItemClaimRepository claimRepository, ItemRepository itemRepository, UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    // Receiver (NGO or INDIVIDUAL) requests an item
    public ClaimResponseDto createClaim(ClaimRequestDto requestDto, UUID receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
                
        Item item = itemRepository.findById(requestDto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Don't allow claims on items that aren't available
        if (item.getStatus() != Item.Status.AVAILABLE) {
            throw new RuntimeException("Item is no longer available");
        }

        ItemClaim claim = new ItemClaim();
        claim.setItem(item);
        claim.setReceiver(receiver);
        claim.setMessage(requestDto.getMessage());
        claim.setStatus(ItemClaim.ClaimStatus.REQUESTED);

        ItemClaim savedClaim = claimRepository.save(claim);

        return mapToDto(savedClaim);
    }

    // Donor approves a claim
    public ClaimResponseDto approveClaim(UUID claimId) {
        ItemClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        if (claim.getStatus() != ItemClaim.ClaimStatus.REQUESTED) {
            throw new RuntimeException("Only requested claims can be approved");
        }

        claim.setStatus(ItemClaim.ClaimStatus.APPROVED);
        ItemClaim savedClaim = claimRepository.save(claim);

        Item item = claim.getItem();
        
        // Reject all other pending claims for this item
        List<ItemClaim> otherClaims = claimRepository.findByItem(item);
        for (ItemClaim otherClaim : otherClaims) {
            if (!otherClaim.getId().equals(claimId) && otherClaim.getStatus() == ItemClaim.ClaimStatus.REQUESTED) {
                otherClaim.setStatus(ItemClaim.ClaimStatus.REJECTED);
                claimRepository.save(otherClaim);
            }
        }

        // Permanently mark the item as claimed
        item.setStatus(Item.Status.CLAIMED);
        itemRepository.save(item);

        return mapToDto(savedClaim);
    }
    
    // Mark a claim as physically fulfilled (completed)
    public ClaimResponseDto fulfillClaim(UUID claimId) {
        ItemClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));
                
        if (claim.getStatus() != ItemClaim.ClaimStatus.APPROVED) {
            throw new RuntimeException("Only approved claims can be marked as fulfilled");
        }

        claim.setStatus(ItemClaim.ClaimStatus.FULFILLED);
        ItemClaim savedClaim = claimRepository.save(claim);
        return mapToDto(savedClaim);
    }
    
    // View claims on a specific item (for the donor)
    public List<ClaimResponseDto> getClaimsForItem(UUID itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
                
        return claimRepository.findByItem(item).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // View claims made by a specific receiver
    public List<ClaimResponseDto> getClaimsByReceiver(UUID receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
                
        return claimRepository.findByReceiver(receiver).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ClaimResponseDto mapToDto(ItemClaim claim) {
        ClaimResponseDto dto = new ClaimResponseDto();
        dto.setId(claim.getId());
        dto.setItemId(claim.getItem().getId());
        dto.setItemTitle(claim.getItem().getTitle());
        dto.setReceiverName(claim.getReceiver().getNameOrOrg());
        dto.setReceiverVerified(claim.getReceiver().isVerified());
        dto.setStatus(claim.getStatus());
        dto.setMessage(claim.getMessage());
        
        // Total Transparency: Only reveal contact details if claim is APPROVED or FULFILLED
        if (claim.getStatus() == ItemClaim.ClaimStatus.APPROVED || 
            claim.getStatus() == ItemClaim.ClaimStatus.FULFILLED) {
            
            // Populate Donor Info
            if (claim.getItem().getDonor() != null) {
                dto.setDonorName(claim.getItem().getDonor().getNameOrOrg());
                dto.setDonorPhone(claim.getItem().getDonor().getPhone());
            }
            
            // Populate Receiver Info
            if (claim.getReceiver() != null) {
                dto.setReceiverPhone(claim.getReceiver().getPhone());
            }
        }
        
        return dto;
    }
}