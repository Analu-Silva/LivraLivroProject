package br.edu.atitus.auth_service.clients;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import br.edu.atitus.auth_service.dtos.UserProfileDTO;

@FeignClient(name = "user-service")
public interface UserServiceClient {

	@PostMapping("/profile/internal/createUserProfile")
	void createProfile(@RequestBody UserProfileDTO profile);

	@DeleteMapping("/ws/profile/internal/deleteAccount/{id}")
	void deleteAccount(@PathVariable UUID id);
}
