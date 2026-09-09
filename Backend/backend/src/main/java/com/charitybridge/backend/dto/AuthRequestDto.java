package com.charitybridge.backend.dto;

import com.charitybridge.backend.model.User.Role;
import lombok.Data;

@Data
public class AuthRequestDto {
    private String email;
    private String password;
    private Role role;
    private String nameOrOrg;
    private String phone;
    private String address;
}
