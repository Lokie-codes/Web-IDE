package com.codeforge.server.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_files", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"project_id", "path"})
})
@Data
public class ProjectFile {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;

    @Column(nullable = false)
    private String path;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_folder")
    private Boolean isFolder = false;

    @Column(name = "parent_path")
    private String parentPath;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
