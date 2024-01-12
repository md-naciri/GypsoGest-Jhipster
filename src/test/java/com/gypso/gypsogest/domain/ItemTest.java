package com.gypso.gypsogest.domain;

import static com.gypso.gypsogest.domain.ItemTestSamples.*;
import static com.gypso.gypsogest.domain.SaleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gypso.gypsogest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Item.class);
        Item item1 = getItemSample1();
        Item item2 = new Item();
        assertThat(item1).isNotEqualTo(item2);

        item2.setId(item1.getId());
        assertThat(item1).isEqualTo(item2);

        item2 = getItemSample2();
        assertThat(item1).isNotEqualTo(item2);
    }

    @Test
    void saleTest() throws Exception {
        Item item = getItemRandomSampleGenerator();
        Sale saleBack = getSaleRandomSampleGenerator();

        item.setSale(saleBack);
        assertThat(item.getSale()).isEqualTo(saleBack);

        item.sale(null);
        assertThat(item.getSale()).isNull();
    }
}
