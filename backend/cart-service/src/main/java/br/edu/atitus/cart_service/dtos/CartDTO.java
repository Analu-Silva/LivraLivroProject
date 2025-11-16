package br.edu.atitus.cart_service.dtos;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public record CartDTO(@NotEmpty @Valid List<CartItemDTO> items) {
}

