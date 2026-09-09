package com.charitybridge.backend.controller;

import com.charitybridge.backend.dto.LeaderboardDto;
import com.charitybridge.backend.dto.StatsResponseDto;
import com.charitybridge.backend.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/global")
    public ResponseEntity<StatsResponseDto> getGlobalStats() {
        return ResponseEntity.ok(statsService.getGlobalStats());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardDto>> getLeaderboard() {
        return ResponseEntity.ok(statsService.getLeaderboard());
    }
}
