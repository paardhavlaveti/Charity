package com.charitybridge.backend.controller;

import com.charitybridge.backend.dto.UserResponseDto;
import com.charitybridge.backend.model.User;
import com.charitybridge.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/ngos")
    public ResponseEntity<List<UserResponseDto>> getAllNGOs() {
        List<User> ngos = userRepository.findByRole(User.Role.NGO);
        return ResponseEntity.ok(ngos.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @PatchMapping("/ngos/{id}/verify")
    public ResponseEntity<UserResponseDto> verifyNGO(@PathVariable UUID id, @RequestParam boolean verified) {
        User ngo = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        
        ngo.setVerified(verified);
        User saved = userRepository.save(ngo);
        
        return ResponseEntity.ok(mapToDto(saved));
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
