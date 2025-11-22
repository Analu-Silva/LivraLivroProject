package br.edu.atitus.auth_service.clients;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "book-service")
public interface BookServiceClient {
	
	@GetMapping("/books/internal/sellers")
	List<UUID> getSellers();

	@DeleteMapping("/ws/books/internal/deleteAccount/{id}")
	void deleteAccount(@PathVariable UUID id);
}
