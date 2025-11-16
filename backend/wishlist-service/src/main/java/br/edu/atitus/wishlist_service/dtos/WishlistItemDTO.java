package br.edu.atitus.wishlist_service.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record WishlistItemDTO(@NotNull UUID bookId) {
}

