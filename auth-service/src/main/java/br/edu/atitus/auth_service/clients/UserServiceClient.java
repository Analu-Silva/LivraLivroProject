package br.edu.atitus.auth_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import br.edu.atitus.auth_service.dtos.UserProfileDTO;

@FeignClient(name = "user-service")
public interface UserServiceClient {

	@PostMapping("/profile/internal/createUserProfile")
	void createProfile(@RequestBody UserProfileDTO profile);
}
