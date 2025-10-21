package br.edu.atitus.product_service.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record BookDTO(

		@NotBlank String imageUrl,

		@NotBlank @Size(min = 1, max = 255) String title,

		@NotNull @Positive @Digits(integer = 5, fraction = 2) @Min(value = 1) @Max(value = 50000) BigDecimal price,

		@NotBlank @Size(min = 3, max = 3) String currency,

		@NotNull @Positive @Min(value = 10) @Max(value = 10000) Integer numberOfPages,

		@NotEmpty @Size(min = 1, max = 5) List<@NotNull @Positive Integer> genresId,

		@NotNull @Positive @Min(value = 1) @Max(value = 2) Integer bookConditionId,

		@NotNull @PositiveOrZero @Min(value = 0) @Max(value = 100) Integer numberOfYears,

		@NotBlank @Size(min = 10, max = 13) String isbn,

		@NotBlank @Size(min = 1, max = 255) String publisher,

		@NotNull @Positive @Min(value = 1) @Max(value = 100) Integer stock,

		@NotNull UUID seller,

		@NotBlank @Size(min = 10, max = 2000) String description) {
}
