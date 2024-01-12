package com.gypso.gypsogest.repository;

import com.gypso.gypsogest.domain.Sale;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Sale entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {}
