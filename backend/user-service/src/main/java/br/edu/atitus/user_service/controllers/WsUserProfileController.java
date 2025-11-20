package br.edu.atitus.user_service.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.user_service.dtos.UserAddressDTO;
import br.edu.atitus.user_service.dtos.UserAddressUpdateDTO;
import br.edu.atitus.user_service.dtos.UserDTO;
import br.edu.atitus.user_service.dtos.UserDetailsRequestDTO;
import br.edu.atitus.user_service.dtos.UserDetailsResponseDTO;
import br.edu.atitus.user_service.dtos.UserUpdateDTO;
import br.edu.atitus.user_service.entities.UserAddressEntity;
import br.edu.atitus.user_service.repositories.UserAddressRepository;
import br.edu.atitus.user_service.repositories.UserProfileRepository;
import br.edu.atitus.user_service.services.UserProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ws/profile")
public class WsUserProfileController {

	private final UserProfileService userProfileService;
	private final UserProfileRepository userProfileRepository;
	private final UserAddressRepository userAddressRepository;

	public WsUserProfileController(UserProfileService userProfileService, UserProfileRepository userProfileRepository,
			UserAddressRepository userAddressRepository) {
		super();
		this.userProfileService = userProfileService;
		this.userProfileRepository = userProfileRepository;
		this.userAddressRepository = userAddressRepository;
	}

	// Informaçoes Gerais do Usuário

	@PatchMapping("/{id}/info")
	public ResponseEntity<UserUpdateDTO> updateUserInfo(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Type") Integer userType) {

		UserUpdateDTO info = userProfileService.alterInfo(id, dto, UserId, userType);

		return ResponseEntity.ok(info);
	}

	@GetMapping("/{id}/info")
	public ResponseEntity<UserDTO> getUserInfo(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		UserDTO info = userProfileService.getInfoById(id, UserId, userType);
		return ResponseEntity.ok(info);
	}

	// Endereço

	@PostMapping("/{id}/address")
	public ResponseEntity<UserAddressEntity> createAddress(@PathVariable UUID id,
			@Valid @RequestBody UserAddressDTO dto, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		UserAddressEntity CreateAddress = userProfileService.addAddress(id, dto, UserId, userType);

		return ResponseEntity.status(201).body(CreateAddress);
	}

	@PatchMapping("/{id}/address")
	public ResponseEntity<UserAddressEntity> updateAddress(@PathVariable UUID id,
			@Valid @RequestBody UserAddressUpdateDTO dto, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		UserAddressEntity UpdateAddress = userProfileService.alterAddress(id, dto, UserId, userType);

		return ResponseEntity.ok(UpdateAddress);
	}

	@GetMapping("/{id}/address")
	public ResponseEntity<UserAddressEntity> getAddress(@PathVariable UUID id, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		UserAddressEntity getAddress = userProfileService.getAddressById(id, UserId, userType);
		return ResponseEntity.ok(getAddress);
	}

	// Detalhes Usuário

//	@PostMapping("/{id}/details")
//	public ResponseEntity<UserDetailsResponseDTO> createDetails(@PathVariable UUID id,
//			@Valid @RequestBody UserDetailsRequestDTO dto, @RequestHeader("X-User-Id") UUID UserId,
//			@RequestHeader("X-User-Type") Integer userType) {
//
//		UserDetailsResponseDTO createDetails = userProfileService.addDetails(id, dto, UserId, userType);
//
//		return ResponseEntity.status(201).body(createDetails);
//	} LÓGICA MOVIDA PARA O AUTH-SERVICEA

	@PatchMapping("/{id}/details")
	public ResponseEntity<UserDetailsResponseDTO> updateDetails(@PathVariable UUID id,
			@Valid @RequestBody UserDetailsRequestDTO dto, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		UserDetailsResponseDTO updateDetails = userProfileService.updateDetails(id, dto, UserId, userType);

		return ResponseEntity.ok(updateDetails);
	}

	@GetMapping("/{id}/details")
	public ResponseEntity<UserDetailsResponseDTO> getDetails(@PathVariable UUID id,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Type") Integer userType) {

		UserDetailsResponseDTO details = userProfileService.getDetailsById(id, UserId, userType);

		return ResponseEntity.ok(details);
	}

	@DeleteMapping("/internal/deleteAccount/{id}")
	public ResponseEntity<Void> deleteUserProfileFromUser(@PathVariable UUID id) {

			userAddressRepository.deleteById(id);
			userProfileRepository.deleteById(id);

		return ResponseEntity.noContent().build();
	}

}
