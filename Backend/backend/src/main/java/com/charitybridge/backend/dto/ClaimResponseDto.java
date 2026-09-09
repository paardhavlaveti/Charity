package com.charitybridge.backend.dto;

import com.charitybridge.backend.model.ItemClaim;
import lombok.Data;
import java.util.UUID;

@Data
public class ClaimResponseDto {
    private UUID id;
    private UUID itemId;
    private String itemTitle;
    private String receiverName;
    private boolean receiverVerified;
    private ItemClaim.ClaimStatus status;
    private String message;
    
    // Transparency fields (populated only when claim is APPROVED or FULFILLED)
    private String donorName;
    private String donorPhone;
    private String receiverPhone;
}