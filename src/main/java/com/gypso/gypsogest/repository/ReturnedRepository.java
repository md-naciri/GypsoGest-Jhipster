package com.gypso.gypsogest.repository;

import com.gypso.gypsogest.domain.Returned;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Returned entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReturnedRepository extends JpaRepository<Returned, Long> {}
