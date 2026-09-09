package com.charitybridge.backend.model; // Change this if your package name is different

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column(name = "name_or_org", nullable = false)
    private String nameOrOrg;
    private String phone;
    private String address;
    private Double latitude;
    private Double longitude;
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    @Column(name = "is_verified", columnDefinition = "boolean default false")
    private boolean isVerified = false;
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    // Define the ENUM directly inside the class
    public enum Role {
        DONOR, NGO, INDIVIDUAL, ADMIN
    }
    // Add these to User.java

    // One Donor can have many Items
    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Item> items;

    // One Receiver (NGO or INDIVIDUAL) can have many Claims
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<ItemClaim> claims;
}