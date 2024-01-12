package com.gypso.gypsogest.web.rest;

import com.gypso.gypsogest.domain.Returned;
import com.gypso.gypsogest.repository.ReturnedRepository;
import com.gypso.gypsogest.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gypso.gypsogest.domain.Returned}.
 */
@RestController
@RequestMapping("/api/returneds")
@Transactional
public class ReturnedResource {

    private final Logger log = LoggerFactory.getLogger(ReturnedResource.class);

    private static final String ENTITY_NAME = "returned";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReturnedRepository returnedRepository;

    public ReturnedResource(ReturnedRepository returnedRepository) {
        this.returnedRepository = returnedRepository;
    }

    /**
     * {@code POST  /returneds} : Create a new returned.
     *
     * @param returned the returned to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new returned, or with status {@code 400 (Bad Request)} if the returned has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Returned> createReturned(@Valid @RequestBody Returned returned) throws URISyntaxException {
        log.debug("REST request to save Returned : {}", returned);
        if (returned.getId() != null) {
            throw new BadRequestAlertException("A new returned cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Returned result = returnedRepository.save(returned);
        return ResponseEntity
            .created(new URI("/api/returneds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /returneds/:id} : Updates an existing returned.
     *
     * @param id the id of the returned to save.
     * @param returned the returned to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated returned,
     * or with status {@code 400 (Bad Request)} if the returned is not valid,
     * or with status {@code 500 (Internal Server Error)} if the returned couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Returned> updateReturned(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Returned returned
    ) throws URISyntaxException {
        log.debug("REST request to update Returned : {}, {}", id, returned);
        if (returned.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, returned.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!returnedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Returned result = returnedRepository.save(returned);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, returned.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /returneds/:id} : Partial updates given fields of an existing returned, field will ignore if it is null
     *
     * @param id the id of the returned to save.
     * @param returned the returned to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated returned,
     * or with status {@code 400 (Bad Request)} if the returned is not valid,
     * or with status {@code 404 (Not Found)} if the returned is not found,
     * or with status {@code 500 (Internal Server Error)} if the returned couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Returned> partialUpdateReturned(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Returned returned
    ) throws URISyntaxException {
        log.debug("REST request to partial update Returned partially : {}, {}", id, returned);
        if (returned.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, returned.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!returnedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Returned> result = returnedRepository
            .findById(returned.getId())
            .map(existingReturned -> {
                if (returned.getPaymentCode() != null) {
                    existingReturned.setPaymentCode(returned.getPaymentCode());
                }

                return existingReturned;
            })
            .map(returnedRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, returned.getId().toString())
        );
    }

    /**
     * {@code GET  /returneds} : get all the returneds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of returneds in body.
     */
    @GetMapping("")
    public List<Returned> getAllReturneds() {
        log.debug("REST request to get all Returneds");
        return returnedRepository.findAll();
    }

    /**
     * {@code GET  /returneds/:id} : get the "id" returned.
     *
     * @param id the id of the returned to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the returned, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Returned> getReturned(@PathVariable("id") Long id) {
        log.debug("REST request to get Returned : {}", id);
        Optional<Returned> returned = returnedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(returned);
    }

    /**
     * {@code DELETE  /returneds/:id} : delete the "id" returned.
     *
     * @param id the id of the returned to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReturned(@PathVariable("id") Long id) {
        log.debug("REST request to delete Returned : {}", id);
        returnedRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
