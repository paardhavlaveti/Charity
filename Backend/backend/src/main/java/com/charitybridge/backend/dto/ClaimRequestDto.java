package com.charitybridge.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ClaimRequestDto {
    private UUID itemId;
    private String message;
}