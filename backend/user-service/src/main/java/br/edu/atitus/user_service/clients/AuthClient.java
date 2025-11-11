package br.edu.atitus.user_service.clients;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "auth-service")
public interface AuthClient {
	
	@GetMapping("/internal/sellers")
	List<UUID> getActiveDistinctSellers();
}
