package com.charitybridge.backend.dto;

import com.charitybridge.backend.model.Item;
import java.util.Map;
import lombok.Data;

@Data
public class ItemRequestDto {
    private String title;
    private String description;
    private String quantity;
    private Item.Category category;
    private String subcategory;
    private Map<String, Object> attributes;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private String formattedAddress;
}