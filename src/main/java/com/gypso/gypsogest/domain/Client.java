package com.gypso.gypsogest.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "items", "client" }, allowSetters = true)
    private Set<Sale> sales = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client" }, allowSetters = true)
    private Set<Transaction> transactions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Client name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Sale> getSales() {
        return this.sales;
    }

    public void setSales(Set<Sale> sales) {
        if (this.sales != null) {
            this.sales.forEach(i -> i.setClient(null));
        }
        if (sales != null) {
            sales.forEach(i -> i.setClient(this));
        }
        this.sales = sales;
    }

    public Client sales(Set<Sale> sales) {
        this.setSales(sales);
        return this;
    }

    public Client addSale(Sale sale) {
        this.sales.add(sale);
        sale.setClient(this);
        return this;
    }

    public Client removeSale(Sale sale) {
        this.sales.remove(sale);
        sale.setClient(null);
        return this;
    }

    public Set<Transaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setClient(null));
        }
        if (transactions != null) {
            transactions.forEach(i -> i.setClient(this));
        }
        this.transactions = transactions;
    }

    public Client transactions(Set<Transaction> transactions) {
        this.setTransactions(transactions);
        return this;
    }

    public Client addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.setClient(this);
        return this;
    }

    public Client removeTransaction(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.setClient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return getId() != null && getId().equals(((Client) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
