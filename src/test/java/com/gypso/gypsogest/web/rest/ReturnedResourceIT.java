package com.gypso.gypsogest.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gypso.gypsogest.IntegrationTest;
import com.gypso.gypsogest.domain.Returned;
import com.gypso.gypsogest.repository.ReturnedRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ReturnedResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReturnedResourceIT {

    private static final String DEFAULT_PAYMENT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_PAYMENT_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/returneds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReturnedRepository returnedRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReturnedMockMvc;

    private Returned returned;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Returned createEntity(EntityManager em) {
        Returned returned = new Returned().paymentCode(DEFAULT_PAYMENT_CODE);
        return returned;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Returned createUpdatedEntity(EntityManager em) {
        Returned returned = new Returned().paymentCode(UPDATED_PAYMENT_CODE);
        return returned;
    }

    @BeforeEach
    public void initTest() {
        returned = createEntity(em);
    }

    @Test
    @Transactional
    void createReturned() throws Exception {
        int databaseSizeBeforeCreate = returnedRepository.findAll().size();
        // Create the Returned
        restReturnedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(returned)))
            .andExpect(status().isCreated());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeCreate + 1);
        Returned testReturned = returnedList.get(returnedList.size() - 1);
        assertThat(testReturned.getPaymentCode()).isEqualTo(DEFAULT_PAYMENT_CODE);
    }

    @Test
    @Transactional
    void createReturnedWithExistingId() throws Exception {
        // Create the Returned with an existing ID
        returned.setId(1L);

        int databaseSizeBeforeCreate = returnedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReturnedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(returned)))
            .andExpect(status().isBadRequest());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPaymentCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = returnedRepository.findAll().size();
        // set the field null
        returned.setPaymentCode(null);

        // Create the Returned, which fails.

        restReturnedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(returned)))
            .andExpect(status().isBadRequest());

        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllReturneds() throws Exception {
        // Initialize the database
        returnedRepository.saveAndFlush(returned);

        // Get all the returnedList
        restReturnedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(returned.getId().intValue())))
            .andExpect(jsonPath("$.[*].paymentCode").value(hasItem(DEFAULT_PAYMENT_CODE)));
    }

    @Test
    @Transactional
    void getReturned() throws Exception {
        // Initialize the database
        returnedRepository.saveAndFlush(returned);

        // Get the returned
        restReturnedMockMvc
            .perform(get(ENTITY_API_URL_ID, returned.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(returned.getId().intValue()))
            .andExpect(jsonPath("$.paymentCode").value(DEFAULT_PAYMENT_CODE));
    }

    @Test
    @Transactional
    void getNonExistingReturned() throws Exception {
        // Get the returned
        restReturnedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReturned() throws Exception {
        // Initialize the database
        returnedRepository.saveAndFlush(returned);

        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();

        // Update the returned
        Returned updatedReturned = returnedRepository.findById(returned.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReturned are not directly saved in db
        em.detach(updatedReturned);
        updatedReturned.paymentCode(UPDATED_PAYMENT_CODE);

        restReturnedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReturned.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReturned))
            )
            .andExpect(status().isOk());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
        Returned testReturned = returnedList.get(returnedList.size() - 1);
        assertThat(testReturned.getPaymentCode()).isEqualTo(UPDATED_PAYMENT_CODE);
    }

    @Test
    @Transactional
    void putNonExistingReturned() throws Exception {
        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();
        returned.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReturnedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, returned.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(returned))
            )
            .andExpect(status().isBadRequest());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReturned() throws Exception {
        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();
        returned.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReturnedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(returned))
            )
            .andExpect(status().isBadRequest());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReturned() throws Exception {
        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();
        returned.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReturnedMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(returned)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReturnedWithPatch() throws Exception {
        // Initialize the database
        returnedRepository.saveAndFlush(returned);

        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();

        // Update the returned using partial update
        Returned partialUpdatedReturned = new Returned();
        partialUpdatedReturned.setId(returned.getId());

        partialUpdatedReturned.paymentCode(UPDATED_PAYMENT_CODE);

        restReturnedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReturned.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReturned))
            )
            .andExpect(status().isOk());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
        Returned testReturned = returnedList.get(returnedList.size() - 1);
        assertThat(testReturned.getPaymentCode()).isEqualTo(UPDATED_PAYMENT_CODE);
    }

    @Test
    @Transactional
    void fullUpdateReturnedWithPatch() throws Exception {
        // Initialize the database
        returnedRepository.saveAndFlush(returned);

        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();

        // Update the returned using partial update
        Returned partialUpdatedReturned = new Returned();
        partialUpdatedReturned.setId(returned.getId());

        partialUpdatedReturned.paymentCode(UPDATED_PAYMENT_CODE);

        restReturnedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReturned.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReturned))
            )
            .andExpect(status().isOk());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
        Returned testReturned = returnedList.get(returnedList.size() - 1);
        assertThat(testReturned.getPaymentCode()).isEqualTo(UPDATED_PAYMENT_CODE);
    }

    @Test
    @Transactional
    void patchNonExistingReturned() throws Exception {
        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();
        returned.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReturnedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, returned.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(returned))
            )
            .andExpect(status().isBadRequest());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReturned() throws Exception {
        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();
        returned.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReturnedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(returned))
            )
            .andExpect(status().isBadRequest());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReturned() throws Exception {
        int databaseSizeBeforeUpdate = returnedRepository.findAll().size();
        returned.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReturnedMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(returned)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Returned in the database
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReturned() throws Exception {
        // Initialize the database
        returnedRepository.saveAndFlush(returned);

        int databaseSizeBeforeDelete = returnedRepository.findAll().size();

        // Delete the returned
        restReturnedMockMvc
            .perform(delete(ENTITY_API_URL_ID, returned.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Returned> returnedList = returnedRepository.findAll();
        assertThat(returnedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
