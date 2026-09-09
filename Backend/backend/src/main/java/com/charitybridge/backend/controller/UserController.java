package com.charitybridge.backend.controller;

import com.charitybridge.backend.dto.UserResponseDto;
import com.charitybridge.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows React to call these APIs later
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody com.charitybridge.backend.dto.AuthRequestDto request) {
        return new ResponseEntity<>(userService.registerUser(request), org.springframework.http.HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> loginUser(@RequestBody com.charitybridge.backend.dto.LoginRequestDto request) {
        return ResponseEntity.ok(userService.loginUser(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserProfile(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateProfile(
            @PathVariable UUID id, 
            @RequestBody com.charitybridge.backend.dto.UpdateProfileRequestDto request) {
        return ResponseEntity.ok(userService.updateProfile(id, request));
    }

    @GetMapping("/ngos")
    public ResponseEntity<List<UserResponseDto>> getAllNgos() {
        return ResponseEntity.ok(userService.getAllNgos());
    }
}