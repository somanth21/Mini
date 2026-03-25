package com.khetai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "query_history")
public class QueryHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // CROP, MANDI, SCHEME, CHAT

    @Column(columnDefinition="TEXT")
    private String queryData; // JSON or raw string

    @Column(columnDefinition="TEXT")
    private String responseData; // Result from Gemini/API

    private LocalDateTime timestamp = LocalDateTime.now();

    public QueryHistory() {}

    public QueryHistory(User user, String type, String queryData, String responseData) {
        this.user = user;
        this.type = type;
        this.queryData = queryData;
        this.responseData = responseData;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getQueryData() { return queryData; }
    public void setQueryData(String queryData) { this.queryData = queryData; }
    public String getResponseData() { return responseData; }
    public void setResponseData(String responseData) { this.responseData = responseData; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
