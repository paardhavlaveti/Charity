package com.charitybridge.backend.repository;

import com.charitybridge.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByClaimIdOrderByCreatedAtAsc(UUID claimId);
}
