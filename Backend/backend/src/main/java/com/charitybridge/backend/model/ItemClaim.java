package com.charitybridge.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "item_claims")
@Data
public class ItemClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Relationship to Item
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    // Relationship to User (Receiver: NGO or INDIVIDUAL)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ngo_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status = ClaimStatus.REQUESTED;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ClaimStatus {
        REQUESTED, APPROVED, FULFILLED, REJECTED
    }
}