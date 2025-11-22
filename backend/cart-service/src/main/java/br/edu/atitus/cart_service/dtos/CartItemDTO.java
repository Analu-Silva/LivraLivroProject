package br.edu.atitus.cart_service.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CartItemDTO(@NotNull UUID bookId, @NotNull @Positive Integer quantity) {
}

