package com.codeforge.server.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "gists")
@Data
public class Gist {
    @Id
    private String id;

    private String title;
    
    @Column(nullable = false)
    private String language;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;
    
    private String theme;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
