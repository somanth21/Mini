package com.khetai.repository;

import com.khetai.entity.QueryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface QueryHistoryRepository extends JpaRepository<QueryHistory, Long> {
    List<QueryHistory> findByUserIdOrderByTimestampDesc(Long userId);
    List<QueryHistory> findAllByOrderByTimestampDesc();

    @Modifying
    @Transactional
    void deleteByUserId(Long userId);
}
