package com.charitybridge.backend.dto;

import com.charitybridge.backend.model.User;
import lombok.Data;
import java.util.UUID;

@Data
public class UserResponseDto {
    private UUID id;
    private String email;
    private User.Role role;
    private String nameOrOrg;
    private String phone;
    private String address;
    private String profileImageUrl;
    private boolean isVerified;
}