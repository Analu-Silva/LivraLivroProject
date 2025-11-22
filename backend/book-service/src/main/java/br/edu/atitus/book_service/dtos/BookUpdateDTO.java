package br.edu.atitus.book_service.dtos;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record BookUpdateDTO(

		@Size(min = 1, max = 5, message = "É necessário colocar no mínimo um e no máximo cinco imagens") 
		List<@NotBlank(message = "É obrigatório a url da imagem") String> imagesUrl,

		@Size(max = 255, message = "Título muito longo") String title,

		@Digits(integer = 5, fraction = 2, message = "Máximo duas casas decimais e cinco dígios antes da vírgula")
		@Min(value = 10, message = "O preço mínimo é 10") 
		@Max(value = 50000, message = "O valor máximo é de 50000") BigDecimal price,

		@Size(min = 3, max = 3, message = "Sigla da moeda inválida") String currency,
 
		@Min(value = 20, message = "Um livro deve ter mais que 20 páginas") 
		@Max(value = 10000, message = "Um livro não pode ter mais que 10000 páginas") Integer numberOfPages,
 
		@Size(min = 1, max = 5, message = "É necessário colocar no mínimo um e no máximo cinco gêneros literários") 
		List<@Min(value = 1, message = "Número do gênero inválido") 
		@Max(value = 16, message = "Número do gênero inválido") Integer> genresId,

		@Min(value = 1, message = "Número da condição inválido") 
		@Max(value = 2, message = "Número da condição inválido") Integer bookConditionId,

		@PositiveOrZero(message = "O livro não pode ter número de anos negativo") 
		@Max(value = 120, message = "O livro deve ter menos que 120 anos") Integer numberOfYears,

		@Size(max = 13, message = "ISBN deve ter 13 dígitos") String isbn,
		
		@Min(value = 1, message = "Número da linguagem inválida") 
		@Max(value = 3, message = "Número da linguagem inválida") Integer bookLanguageId,

		@Size(max = 255, message = "Nome da editora muito longo") String publisher,

		@Min(value = 1, message = "É necessário pelo menos uma unidade no estoque") 
		@Max(value = 100, message = "O número máximo de unidades é 100") Integer stock,

		@Size(max = 255, message = "Nome do autor muito longo") String author,

		@Size(min = 30, max = 2000, message = "A descrição deve ter entre 30 e 2000 caracteres") String description) {
}
