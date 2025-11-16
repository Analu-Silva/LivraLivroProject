package br.edu.atitus.wishlist_service.dtos;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class WishlistItemRequestDTO {

    @NotNull(message = "bookId cannot be null")
    private UUID bookId;

    // Getters e Setters
    public UUID getBookId() {
        return bookId;
    }

    public void setBookId(UUID bookId) {
        this.bookId = bookId;
    }
}
