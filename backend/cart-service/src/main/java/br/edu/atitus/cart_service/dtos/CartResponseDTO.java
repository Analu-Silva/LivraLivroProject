package br.edu.atitus.cart_service.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class CartResponseDTO {
    private UUID id;
    private List<CartItemResponseDTO> items;
    private BigDecimal totalPrice;
    private BigDecimal totalConvertedPrice;

    // Getters e setters
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public List<CartItemResponseDTO> getItems() {
        return items;
    }
    public void setItems(List<CartItemResponseDTO> items) {
        this.items = items;
    }
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
    public BigDecimal getTotalConvertedPrice() {
        return totalConvertedPrice;
    }
    public void setTotalConvertedPrice(BigDecimal totalConvertedPrice) {
        this.totalConvertedPrice = totalConvertedPrice;
    }
}