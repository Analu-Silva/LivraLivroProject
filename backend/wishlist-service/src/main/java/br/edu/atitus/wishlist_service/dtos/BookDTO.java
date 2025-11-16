package br.edu.atitus.wishlist_service.clients.dtos;

import java.math.BigDecimal;
import java.util.UUID;

public class BookDTO {

    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;

    // Getters e setters
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    public String getCurrency() {
        return currency;
    }
    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
