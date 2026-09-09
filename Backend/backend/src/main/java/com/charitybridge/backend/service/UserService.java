package com.charitybridge.backend.service;

import com.charitybridge.backend.dto.UserResponseDto;
import com.charitybridge.backend.model.User;
import com.charitybridge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDto getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    public List<UserResponseDto> getAllNgos() {
        List<User> ngos = userRepository.findByRole(User.Role.NGO);
        return ngos.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public UserResponseDto registerUser(com.charitybridge.backend.dto.AuthRequestDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setNameOrOrg(request.getNameOrOrg());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    public UserResponseDto loginUser(com.charitybridge.backend.dto.LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return mapToDto(user);
    }

    public UserResponseDto updateProfile(UUID userId, com.charitybridge.backend.dto.UpdateProfileRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getNameOrOrg() != null) user.setNameOrOrg(request.getNameOrOrg());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    private UserResponseDto mapToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setNameOrOrg(user.getNameOrOrg());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setVerified(user.isVerified());
        return dto;
    }
}