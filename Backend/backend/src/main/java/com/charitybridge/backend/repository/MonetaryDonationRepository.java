package com.charitybridge.backend.repository;

import com.charitybridge.backend.model.MonetaryDonation;
import com.charitybridge.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonetaryDonationRepository extends JpaRepository<MonetaryDonation, UUID> {
    
    List<MonetaryDonation> findByDonor(User donor);
    
    List<MonetaryDonation> findByNgo(User ngo);
    
    // Useful for validating payment gateway callbacks
    Optional<MonetaryDonation> findByGatewayTxId(String gatewayTxId);
}