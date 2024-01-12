package com.gypso.gypsogest.domain;

import static com.gypso.gypsogest.domain.ClientTestSamples.*;
import static com.gypso.gypsogest.domain.SaleTestSamples.*;
import static com.gypso.gypsogest.domain.TransactionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gypso.gypsogest.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Client.class);
        Client client1 = getClientSample1();
        Client client2 = new Client();
        assertThat(client1).isNotEqualTo(client2);

        client2.setId(client1.getId());
        assertThat(client1).isEqualTo(client2);

        client2 = getClientSample2();
        assertThat(client1).isNotEqualTo(client2);
    }

    @Test
    void saleTest() throws Exception {
        Client client = getClientRandomSampleGenerator();
        Sale saleBack = getSaleRandomSampleGenerator();

        client.addSale(saleBack);
        assertThat(client.getSales()).containsOnly(saleBack);
        assertThat(saleBack.getClient()).isEqualTo(client);

        client.removeSale(saleBack);
        assertThat(client.getSales()).doesNotContain(saleBack);
        assertThat(saleBack.getClient()).isNull();

        client.sales(new HashSet<>(Set.of(saleBack)));
        assertThat(client.getSales()).containsOnly(saleBack);
        assertThat(saleBack.getClient()).isEqualTo(client);

        client.setSales(new HashSet<>());
        assertThat(client.getSales()).doesNotContain(saleBack);
        assertThat(saleBack.getClient()).isNull();
    }

    @Test
    void transactionTest() throws Exception {
        Client client = getClientRandomSampleGenerator();
        Transaction transactionBack = getTransactionRandomSampleGenerator();

        client.addTransaction(transactionBack);
        assertThat(client.getTransactions()).containsOnly(transactionBack);
        assertThat(transactionBack.getClient()).isEqualTo(client);

        client.removeTransaction(transactionBack);
        assertThat(client.getTransactions()).doesNotContain(transactionBack);
        assertThat(transactionBack.getClient()).isNull();

        client.transactions(new HashSet<>(Set.of(transactionBack)));
        assertThat(client.getTransactions()).containsOnly(transactionBack);
        assertThat(transactionBack.getClient()).isEqualTo(client);

        client.setTransactions(new HashSet<>());
        assertThat(client.getTransactions()).doesNotContain(transactionBack);
        assertThat(transactionBack.getClient()).isNull();
    }
}
