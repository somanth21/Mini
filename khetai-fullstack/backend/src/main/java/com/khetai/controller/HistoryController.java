package com.khetai.controller;

import com.khetai.dto.ApiResponse;
import com.khetai.entity.QueryHistory;
import com.khetai.entity.User;
import com.khetai.repository.QueryHistoryRepository;
import com.khetai.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final QueryHistoryRepository queryHistoryRepository;
    private final UserRepository userRepository;

    public HistoryController(QueryHistoryRepository queryHistoryRepository, UserRepository userRepository) {
        this.queryHistoryRepository = queryHistoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QueryHistory>>> getHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if(email == null || email.equals("anonymousUser")) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        User user = userRepository.findByEmail(email).orElseThrow();
        List<QueryHistory> history = queryHistoryRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.success("History fetched", history));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<QueryHistory>> saveHistory(@RequestBody Map<String, String> data) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if(email == null || email.equals("anonymousUser")) {
             return ResponseEntity.ok(ApiResponse.success("Ignored saving without login", null));
        }
        User user = userRepository.findByEmail(email).orElseThrow();
        QueryHistory qh = new QueryHistory(user, data.get("type"), data.get("queryData"), data.get("responseData"));
        qh = queryHistoryRepository.save(qh);
        return ResponseEntity.ok(ApiResponse.success("Saved", qh));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if(email == null || email.equals("anonymousUser")) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        User user = userRepository.findByEmail(email).orElseThrow();
        queryHistoryRepository.deleteByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success("History cleared successfully", null));
    }
}
