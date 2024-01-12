package com.gypso.gypsogest.domain;

import static com.gypso.gypsogest.domain.ClientTestSamples.*;
import static com.gypso.gypsogest.domain.TransactionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gypso.gypsogest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TransactionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Transaction.class);
        Transaction transaction1 = getTransactionSample1();
        Transaction transaction2 = new Transaction();
        assertThat(transaction1).isNotEqualTo(transaction2);

        transaction2.setId(transaction1.getId());
        assertThat(transaction1).isEqualTo(transaction2);

        transaction2 = getTransactionSample2();
        assertThat(transaction1).isNotEqualTo(transaction2);
    }

    @Test
    void clientTest() throws Exception {
        Transaction transaction = getTransactionRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        transaction.setClient(clientBack);
        assertThat(transaction.getClient()).isEqualTo(clientBack);

        transaction.client(null);
        assertThat(transaction.getClient()).isNull();
    }
}
