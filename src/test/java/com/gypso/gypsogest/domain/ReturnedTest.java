package com.gypso.gypsogest.domain;

import static com.gypso.gypsogest.domain.ReturnedTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gypso.gypsogest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReturnedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Returned.class);
        Returned returned1 = getReturnedSample1();
        Returned returned2 = new Returned();
        assertThat(returned1).isNotEqualTo(returned2);

        returned2.setId(returned1.getId());
        assertThat(returned1).isEqualTo(returned2);

        returned2 = getReturnedSample2();
        assertThat(returned1).isNotEqualTo(returned2);
    }
}
