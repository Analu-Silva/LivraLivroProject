package br.edu.atitus.user_service.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.user_service.clients.AuthClient;
import br.edu.atitus.user_service.dtos.UserDTO;
import br.edu.atitus.user_service.entities.UserProfileEntity;
import br.edu.atitus.user_service.exceptions.InvalidDataException;
import br.edu.atitus.user_service.repositories.UserProfileRepository;
import br.edu.atitus.user_service.services.UserProfileService;

@RestController
@RequestMapping("/profile")
public class OpenUserProfileController {

	private final UserProfileService userProfileService;
	private final AuthClient authClient;
	private final UserProfileRepository userProfileRepository;

	public OpenUserProfileController(UserProfileService userProfileService, AuthClient authClient, UserProfileRepository userProfileRepository) {
		super();
		this.userProfileService = userProfileService;
		this.authClient = authClient;
		this.userProfileRepository = userProfileRepository;
	}

	@PostMapping("/internal/createUserProfile")
	public ResponseEntity<?> createProfile(@RequestBody UserDTO dto) {
		try {
			UserProfileEntity savedProfile = userProfileService.createProfile(dto);
			return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);

		} catch (InvalidDataException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
	
	@GetMapping("/sellers")
	public ResponseEntity<List<UserProfileEntity>> getSellerList() {
		List<UUID> sellerIds = authClient.getActiveDistinctSellers();
		
		if(sellerIds == null || sellerIds.isEmpty()) {
			return ResponseEntity.ok(new ArrayList<>());
		}
		
		List<UserProfileEntity> sellers = userProfileRepository.findAllById(sellerIds);
		
		return ResponseEntity.ok(sellers);
	}
}
