package com.charitybridge.backend.dto;

import lombok.Data;

@Data
public class UpdateProfileRequestDto {
    private String nameOrOrg;
    private String phone;
    private String address;
    private String profileImageUrl;
}
