package com.charitybridge.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class LeaderboardDto {
    private UUID donorId;
    private String donorName;
    private long fulfilledItemsCount;
    private String badge;
}
