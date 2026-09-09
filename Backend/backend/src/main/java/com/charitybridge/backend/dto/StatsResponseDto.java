package com.charitybridge.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class StatsResponseDto {
    private long totalItemsDonated;
    private long totalItemsFulfilled;
    private long totalActiveNGOs;
    private Map<String, Long> itemsByCategory;
}
