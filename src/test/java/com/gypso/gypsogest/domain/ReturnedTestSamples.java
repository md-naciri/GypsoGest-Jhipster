package com.gypso.gypsogest.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReturnedTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Returned getReturnedSample1() {
        return new Returned().id(1L).paymentCode("paymentCode1");
    }

    public static Returned getReturnedSample2() {
        return new Returned().id(2L).paymentCode("paymentCode2");
    }

    public static Returned getReturnedRandomSampleGenerator() {
        return new Returned().id(longCount.incrementAndGet()).paymentCode(UUID.randomUUID().toString());
    }
}
