
package com.charitybridge.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "monetary_donations")
@Data
public class MonetaryDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Relationship to User (Donor)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id")
    private User donor;

    // Relationship to User (NGO)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ngo_id")
    private User ngo;

    @Column(nullable = false)
    private BigDecimal amount;

    private String currency = "INR";

    @Column(name = "gateway_tx_id", unique = true)
    private String gatewayTxId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.INITIATED;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum PaymentStatus {
        INITIATED, SUCCESS, FULFILLED
    }
}