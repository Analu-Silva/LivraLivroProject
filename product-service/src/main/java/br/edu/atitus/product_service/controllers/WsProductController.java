package br.edu.atitus.product_service.controllers;

import java.util.List;
import java.util.UUID;

import javax.security.sasl.AuthenticationException;

import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.product_service.dtos.BookDTO;
import br.edu.atitus.product_service.entities.BookConditionEntity;
import br.edu.atitus.product_service.entities.BookEntity;
import br.edu.atitus.product_service.entities.BookGenreEntity;
import br.edu.atitus.product_service.repositories.BookConditionRepository;
import br.edu.atitus.product_service.repositories.BookGenreRepository;
import br.edu.atitus.product_service.repositories.BookRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ws/books")
public class WsProductController {
	private final BookRepository repository;
	private BookGenreRepository bookGenreRepository;
	private BookConditionRepository bookConditionRepository;

	public WsProductController(BookRepository repository, BookGenreRepository bookGenreRepository,
			BookConditionRepository bookConditionRepository) {
		super();
		this.repository = repository;
		this.bookGenreRepository = bookGenreRepository;
		this.bookConditionRepository = bookConditionRepository;
	}

	private BookEntity convertDto2Entity(BookDTO dto) throws Exception {
		var product = new BookEntity();
		BeanUtils.copyProperties(dto, product);

		if (dto.genresId() != null && !dto.genresId().isEmpty()) {
			List<BookGenreEntity> genres = bookGenreRepository.findAllById(dto.genresId());
			product.setGenre(genres);
		}

		if (dto.bookConditionId() != null) {
			BookConditionEntity condition = bookConditionRepository.findById(dto.bookConditionId())
					.orElseThrow(() -> new Exception("Book Contidition not found"));
			product.setBookCondition(condition);
		}

		return product;
	}

	@PostMapping
	public ResponseEntity<BookEntity> createBook(@Valid @RequestBody BookDTO dto, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		var product = convertDto2Entity(dto);
		repository.save(product);

		return ResponseEntity.status(201).body(product);
	}

	@PatchMapping("/{idProduct}")
	public ResponseEntity<BookEntity> updateBook(@PathVariable UUID idProduct, @Valid @RequestBody BookDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Email") String emailUser,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		var product = convertDto2Entity(dto);
		product.setId(idProduct);
		repository.save(product);

		return ResponseEntity.ok(product);
	}

	@DeleteMapping("/{idProduct}")
	public ResponseEntity<String> deleteBook(@PathVariable UUID idProduct, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		repository.deleteById(idProduct);

		return ResponseEntity.ok("Excluído"); // Ou null
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<String> handlerAuth(AuthenticationException e) {
		String message = e.getMessage().replaceAll("[\\r\\n]", "");
		return ResponseEntity.status(403).body(message);
	}
}
