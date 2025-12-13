package com.codeforge.server.repository;

import com.codeforge.server.model.Gist;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GistRepository extends JpaRepository<Gist, String> {
    @Query("SELECT g FROM Gist g ORDER BY g.createdAt DESC")
    List<Gist> findLatest(Pageable pageable);
}
