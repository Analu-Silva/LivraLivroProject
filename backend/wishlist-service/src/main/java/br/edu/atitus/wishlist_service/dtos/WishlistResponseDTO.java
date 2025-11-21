package br.edu.atitus.wishlist_service.dtos;

import java.util.List;
import java.util.UUID;

public class WishlistResponseDTO {
    private UUID id;
    private List<WishlistItemResponseDTO> items;

    // Getters e setters
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public List<WishlistItemResponseDTO> getItems() {
        return items;
    }
    public void setItems(List<WishlistItemResponseDTO> items) {
        this.items = items;
    }
}