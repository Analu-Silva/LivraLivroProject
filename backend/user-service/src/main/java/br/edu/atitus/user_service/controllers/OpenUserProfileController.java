package br.edu.atitus.user_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.user_service.dtos.UserDTO;
import br.edu.atitus.user_service.entities.UserProfileEntity;
import br.edu.atitus.user_service.exceptions.InvalidDataException;
import br.edu.atitus.user_service.services.UserProfileService;

@RestController
@RequestMapping("/profile")
public class OpenUserProfileController {

	private final UserProfileService userProfileService;

	public OpenUserProfileController(UserProfileService userProfileService) {
		super();
		this.userProfileService = userProfileService;
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
}
