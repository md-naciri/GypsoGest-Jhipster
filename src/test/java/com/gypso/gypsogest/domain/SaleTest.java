package com.gypso.gypsogest.domain;

import static com.gypso.gypsogest.domain.ClientTestSamples.*;
import static com.gypso.gypsogest.domain.ItemTestSamples.*;
import static com.gypso.gypsogest.domain.SaleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gypso.gypsogest.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SaleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sale.class);
        Sale sale1 = getSaleSample1();
        Sale sale2 = new Sale();
        assertThat(sale1).isNotEqualTo(sale2);

        sale2.setId(sale1.getId());
        assertThat(sale1).isEqualTo(sale2);

        sale2 = getSaleSample2();
        assertThat(sale1).isNotEqualTo(sale2);
    }

    @Test
    void itemTest() throws Exception {
        Sale sale = getSaleRandomSampleGenerator();
        Item itemBack = getItemRandomSampleGenerator();

        sale.addItem(itemBack);
        assertThat(sale.getItems()).containsOnly(itemBack);
        assertThat(itemBack.getSale()).isEqualTo(sale);

        sale.removeItem(itemBack);
        assertThat(sale.getItems()).doesNotContain(itemBack);
        assertThat(itemBack.getSale()).isNull();

        sale.items(new HashSet<>(Set.of(itemBack)));
        assertThat(sale.getItems()).containsOnly(itemBack);
        assertThat(itemBack.getSale()).isEqualTo(sale);

        sale.setItems(new HashSet<>());
        assertThat(sale.getItems()).doesNotContain(itemBack);
        assertThat(itemBack.getSale()).isNull();
    }

    @Test
    void clientTest() throws Exception {
        Sale sale = getSaleRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        sale.setClient(clientBack);
        assertThat(sale.getClient()).isEqualTo(clientBack);

        sale.client(null);
        assertThat(sale.getClient()).isNull();
    }
}
