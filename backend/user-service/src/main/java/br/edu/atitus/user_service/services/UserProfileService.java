package br.edu.atitus.user_service.services;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.atitus.user_service.exceptions.ResourceNotFoundException;
import br.edu.atitus.user_service.exceptions.ResourceAlreadyExistsException;
import br.edu.atitus.user_service.components.CpfMathematicalValidator;
import br.edu.atitus.user_service.components.CpfValidator;
import br.edu.atitus.user_service.dtos.UserAddressDTO;
import br.edu.atitus.user_service.dtos.UserAddressUpdateDTO;
import br.edu.atitus.user_service.dtos.UserDTO;
import br.edu.atitus.user_service.dtos.UserDetailsRequestDTO;
import br.edu.atitus.user_service.dtos.UserDetailsResponseDTO;
import br.edu.atitus.user_service.dtos.UserUpdateDTO;
import br.edu.atitus.user_service.entities.UserAddressEntity;
import br.edu.atitus.user_service.entities.UserProfileEntity;
import br.edu.atitus.user_service.entities.UserProfileGenreEntity;
import br.edu.atitus.user_service.exceptions.InvalidDataException;
import br.edu.atitus.user_service.repositories.UserAddressRepository;
import br.edu.atitus.user_service.repositories.UserGenreRepository;
import br.edu.atitus.user_service.repositories.UserProfileRepository;

@Service
public class UserProfileService {

	private final UserProfileRepository userProfileRepository;
	private final UserGenreRepository userGenreRepository;
	
	public UserProfileService(UserProfileRepository userProfileRepository, UserGenreRepository userGenreRepository,
			UserAddressRepository userAddressRepository) {
		super();
		this.userProfileRepository = userProfileRepository;
		this.userGenreRepository = userGenreRepository;
	}

	private void validateCpf(String cpf) {
		if (!CpfValidator.validateCpf(cpf.trim()))
			throw new InvalidDataException("cpf: Cpf inválido");
	}

	private void validateMathCpf(String cpf) {
		if (!CpfMathematicalValidator.validateMathCpf(cpf.trim()))
			throw new InvalidDataException("cpf: Cpf inválido");
	}

	private void validateCpfUniquenessWithIdNull(String cpf) {
		if (userProfileRepository.existsByCpf(cpf.trim()))
			throw new ResourceAlreadyExistsException("cpf: Já existe usuário com este cpf");
	}

	private void validateCpfUniquenessWithIdNotNull(UUID id, String cpf) {
		if (userProfileRepository.existsByCpfAndIdNot(cpf, id))
			throw new ResourceAlreadyExistsException("cpf: Já existe usuário com este cpf");
	}

	private void validateDateOfBirth(LocalDate dateOfBirth) {

		LocalDate today = LocalDate.now();
		LocalDate maxAge = today.minusYears(120);

		if (dateOfBirth.isBefore(maxAge))
			throw new InvalidDataException("dateOfBirth: A idade parece não ser verdadeira");
	}

	private void validateUserType(Integer userType) {
		if (userType != 0 && userType != 1)
			throw new SecurityException("Usuário sem permissão");
	}

	private void validateUserTypeAndById(UUID id, UUID UserId, Integer userType) {

		if (userType != 0 && !id.equals(UserId))
			throw new SecurityException("Você não está autorizado a modificar dados de outros usuários");
	}

	private UserProfileEntity findUserById(UUID id) {
		return userProfileRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
	}

	// Informaçoes Gerais do Usuário

	@Transactional
	public UserProfileEntity createProfile(UserDTO dto) {

		validateCpf(dto.cpf());
		validateMathCpf(dto.cpf());
		validateCpfUniquenessWithIdNull(dto.cpf());
		validateCpfUniquenessWithIdNotNull(dto.id(), dto.cpf());
		validateDateOfBirth(dto.dateOfBirth());

		UserProfileEntity profile = new UserProfileEntity();

		profile.setId(dto.id());
		profile.setName(dto.name());
		profile.setCpf(dto.cpf());
		profile.setPhoneNumber(dto.phoneNumber());
		profile.setDateOfBirth(dto.dateOfBirth());

		UserProfileEntity savedProfile = userProfileRepository.save(profile);

		return savedProfile;
	}

	@Transactional
	public UserUpdateDTO alterInfo(UUID id, UserUpdateDTO dto, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		validateDateOfBirth(dto.dateOfBirth());

		UserProfileEntity profile = findUserById(id);

		if (dto.name() != null && !dto.name().isEmpty()) {
			profile.setName(dto.name());
		}

		if (dto.phoneNumber() != null && !dto.phoneNumber().isEmpty()) {
			profile.setPhoneNumber(dto.phoneNumber());
		}

		if (dto.dateOfBirth() != null) {
			validateDateOfBirth(dto.dateOfBirth());

			profile.setDateOfBirth(dto.dateOfBirth());
		}

		UserProfileEntity savedProfile = userProfileRepository.save(profile);

		return convertToUpdateInfoDTO(savedProfile);

	}

	@Transactional
	public UserDTO getInfoById(UUID id, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserProfileEntity profile = findUserById(id);

		return convertToInfoDTO(profile);
	}

	// Endereço

	@Transactional
	public UserAddressEntity addAddress(UUID id, UserAddressDTO dto, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserProfileEntity profile = findUserById(id);

		UserAddressEntity address = new UserAddressEntity();

		address.setCep(dto.cep());
		address.setCity(dto.city());
		address.setState(dto.state());
		address.setNeighborhood(dto.neighborhood());
		address.setStreet(dto.street());
		address.setStreetNumber(dto.streetNumber());
		address.setComplement(dto.complement());

		address.setUserProfileEntity(profile);
		profile.setUserAddressEntity(address);

		UserProfileEntity savedProfile = userProfileRepository.save(profile);

		return savedProfile.getUserAddressEntity();
	}

	@Transactional
	public UserAddressEntity alterAddress(UUID id, UserAddressUpdateDTO dto, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserProfileEntity profile = findUserById(id);

		UserAddressEntity address = profile.getUserAddressEntity();

		if (address == null) {
			throw new ResourceNotFoundException("Usuário não possui endereço");
		}

		if (dto.cep() != null && !dto.cep().isEmpty()) {
			address.setCep(dto.cep());
		}

		if (dto.city() != null && !dto.city().isEmpty()) {
			address.setCity(dto.city());
		}

		if (dto.state() != null && !dto.state().isEmpty()) {
			address.setState(dto.state());
		}

		if (dto.neighborhood() != null && !dto.neighborhood().isEmpty()) {
			address.setNeighborhood(dto.neighborhood());
		}

		if (dto.street() != null && !dto.street().isEmpty()) {
			address.setStreet(dto.street());
		}

		if (dto.streetNumber() != null && !dto.streetNumber().isEmpty()) {
			address.setStreetNumber(dto.streetNumber());
		}

		if (dto.complement() != null && !dto.complement().isEmpty()) {
			address.setComplement(dto.complement());
		}

		userProfileRepository.save(profile);

		return address;
	}

	@Transactional
	public UserAddressEntity getAddressById(UUID id, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserProfileEntity profile = userProfileRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Falha em buscar endereço"));

		UserAddressEntity address = profile.getUserAddressEntity();

		if (address == null) {
			throw new ResourceNotFoundException("Endereço não informado");
		}
		return address;
	}

	// Detalhes

	@Transactional
	public UserDetailsResponseDTO addDetails(UUID id, UserDetailsRequestDTO dto, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserProfileEntity profile = findUserById(id);

		if (dto.userGenreId() != null) {
			UserProfileGenreEntity genre = userGenreRepository.findById(dto.userGenreId())
					.orElseThrow(() -> new ResourceNotFoundException("Gênero não encontrado"));
			profile.setUserGenre(genre);
		}

		if (dto.userImageUrl() != null && !dto.userImageUrl().isEmpty()) {
			profile.setUserImageUrl(dto.userImageUrl());
		}

		if (dto.description() != null && !dto.description().isEmpty()) {
			profile.setDescription(dto.description());
		}

		UserProfileEntity savedProfile = userProfileRepository.save(profile);

		return convertToDetailsDTO(savedProfile);
	}

	@Transactional
	public UserDetailsResponseDTO updateDetails(UUID id, UserDetailsRequestDTO dto, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserProfileEntity profile = findUserById(id);

		if (dto.userGenreId() != null) {
			UserProfileGenreEntity genre = userGenreRepository.findById(dto.userGenreId())
					.orElseThrow(() -> new ResourceNotFoundException("Gênero não encontrado"));
			profile.setUserGenre(genre);
		}

		if (dto.userImageUrl() != null && !dto.userImageUrl().isEmpty()) {
			profile.setUserImageUrl(dto.userImageUrl());
		}

		if (dto.description() != null && !dto.description().isEmpty()) {
			profile.setDescription(dto.description());
		}

		UserProfileEntity savedProfile = userProfileRepository.save(profile);

		return convertToDetailsDTO(savedProfile);
	}

	@Transactional
	public UserDetailsResponseDTO getDetailsById(UUID id, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserProfileEntity profile = findUserById(id);

		return convertToDetailsDTO(profile);
	}

	@Transactional
	public void deleteUserAccount(UUID id, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);
		
		//Se colocar lógica aqui dá um bug
	}
	
	// Mappers

	private UserDTO convertToInfoDTO(UserProfileEntity profile) {
		return new UserDTO(profile.getId(), profile.getName(), profile.getCpf(), profile.getPhoneNumber(),
				profile.getDateOfBirth());
	}

	private UserUpdateDTO convertToUpdateInfoDTO(UserProfileEntity profile) {
		return new UserUpdateDTO(profile.getId(), profile.getName(), profile.getPhoneNumber(),
				profile.getDateOfBirth());
	}

	private UserDetailsResponseDTO convertToDetailsDTO(UserProfileEntity profile) {

		Integer genreId = (profile.getUserGenre() != null) ? profile.getUserGenre().getId() : null;

		return new UserDetailsResponseDTO(profile.getUserImageUrl(), profile.getUserGenre(), profile.getDescription());
	}
}
