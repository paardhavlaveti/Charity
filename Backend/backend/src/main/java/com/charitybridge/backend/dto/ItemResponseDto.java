package com.charitybridge.backend.dto;

import com.charitybridge.backend.model.Item;
import lombok.Data;
import java.util.UUID;

@Data
public class ItemResponseDto {
    private UUID id;
    private String title;
    private String description;
    private String quantity;
    private Item.Category category;
    private String imageUrl;
    private Item.Status status;
    private String donorName; // Flattened data
    private String donorCity; // Flattened data
    private Double latitude;
    private Double longitude;
}