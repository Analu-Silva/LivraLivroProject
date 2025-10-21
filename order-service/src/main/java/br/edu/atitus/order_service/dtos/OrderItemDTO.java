package br.edu.atitus.order_service.dtos;

import java.util.UUID;

public record OrderItemDTO(UUID productId, Integer quantity) {}