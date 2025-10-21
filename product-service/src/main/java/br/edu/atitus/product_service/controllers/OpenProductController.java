package br.edu.atitus.product_service.controllers;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.product_service.clients.CurrencyClient;
import br.edu.atitus.product_service.clients.CurrencyResponse;
import br.edu.atitus.product_service.entities.BookEntity;
import br.edu.atitus.product_service.repositories.BookRepository;

@RestController
@RequestMapping("/books")
public class OpenProductController {

	private final BookRepository repository;
	private final CurrencyClient currencyClient;
	private final CacheManager cacheManager;

	public OpenProductController(BookRepository repository, CurrencyClient currencyClient, CacheManager cacheManager) {
		super();
		this.repository = repository;
		this.currencyClient = currencyClient;
		this.cacheManager = cacheManager;
	}

	@Value("${server.port}")
	private int serverPort;

	@GetMapping("/{idProduct}/{targetCurrency}")
	public ResponseEntity<BookEntity> getProduct(@PathVariable UUID idProduct, @PathVariable String targetCurrency)
			throws Exception {

		targetCurrency = targetCurrency.toUpperCase();
		String nameCache = "Product";
		String keyCache = idProduct + targetCurrency;

		BookEntity product = cacheManager.getCache(nameCache).get(keyCache, BookEntity.class);

		if (product == null) {
			product = repository.findById(idProduct).orElseThrow(() -> new Exception("Product not found"));
			product.setEnvironment("Product-service running on Port: " + serverPort);

			if (targetCurrency.equalsIgnoreCase(product.getCurrency()))
				product.setConvertedPrice(product.getPrice());
			else {
				CurrencyResponse currency = currencyClient.getCurrency(product.getPrice(), product.getCurrency(),
						targetCurrency);
				if (currency != null) {
					product.setConvertedPrice(currency.getConvertedValue());
					product.setEnvironment(product.getEnvironment() + " - " + currency.getEnvironment());
					cacheManager.getCache(nameCache).put(keyCache, product);
				} else {
					product.setConvertedPrice(BigDecimal.ONE.negate());
					product.setEnvironment(product.getEnvironment() + " - Currency unavailable");
				}

			}
		} else {
			product.setEnvironment("Product-service running on Port: " + serverPort + " - DataSource: cache");
		}

		return ResponseEntity.ok(product);
	}

	@GetMapping("/noconverter/{idProduct}")
	public ResponseEntity<BookEntity> getNoConverter(@PathVariable UUID idProduct) throws Exception {
		var product = repository.findById(idProduct).orElseThrow(() -> new Exception("Produto não encontrado"));
		product.setConvertedPrice(BigDecimal.ONE.negate());
		product.setEnvironment("Product-service running on Port: " + serverPort);
		return ResponseEntity.ok(product);
	}

	@GetMapping("/{targetCurrency}")
	public ResponseEntity<Page<BookEntity>> getAllProducts(@PathVariable String targetCurrency,
			@PageableDefault(page = 0, size = 5, sort = "description", direction = Direction.ASC) Pageable pageable)
			throws Exception {
		Page<BookEntity> products = repository.findAll(pageable);
		for (BookEntity product : products) {
			CurrencyResponse currency = currencyClient.getCurrency(product.getPrice(), product.getCurrency(),
					targetCurrency);

			product.setConvertedPrice(currency.getConvertedValue());
			// Setar o ambiente
			product.setEnvironment(
					"Product-Service running on port: " + serverPort + " - " + currency.getEnvironment()); // + " - " +
																											// cambio.getAmbiente());
		}
		return ResponseEntity.ok(products);

	}
}
