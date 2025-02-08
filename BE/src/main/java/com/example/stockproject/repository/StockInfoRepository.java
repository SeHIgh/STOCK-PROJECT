package com.example.stockproject.repository;

import com.example.stockproject.dto.StockInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockInfoRepository extends JpaRepository<StockInfo, Long> {
}
