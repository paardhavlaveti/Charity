package com.charitybridge.backend.controller;

import com.charitybridge.backend.model.ChatMessage;
import com.charitybridge.backend.repository.ChatMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatMessageRepository chatMessageRepository, SimpMessagingTemplate messagingTemplate) {
        this.chatMessageRepository = chatMessageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // Handles live messages sent via WebSocket
    @MessageMapping("/chat/{claimId}")
    public void sendMessage(@DestinationVariable UUID claimId, @Payload ChatMessage chatMessage) {
        chatMessage.setClaimId(claimId);
        
        // Save to database
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        
        // Broadcast to all subscribers of this claim's chat room
        messagingTemplate.convertAndSend("/topic/chat/" + claimId, savedMessage);
    }

    // Handles fetching historical messages via standard REST API
    @GetMapping("/api/chat/{claimId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable UUID claimId) {
        return ResponseEntity.ok(chatMessageRepository.findByClaimIdOrderByCreatedAtAsc(claimId));
    }
}
