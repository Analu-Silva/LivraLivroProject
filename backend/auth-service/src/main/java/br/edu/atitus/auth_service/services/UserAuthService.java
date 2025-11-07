package br.edu.atitus.auth_service.services;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.atitus.auth_service.clients.BookServiceClient;
import br.edu.atitus.auth_service.clients.UserServiceClient;
import br.edu.atitus.auth_service.components.PasswordValidator;
import br.edu.atitus.auth_service.components.EmailValidator;
import br.edu.atitus.auth_service.dtos.CredentialsUpdateDTO;
import br.edu.atitus.auth_service.dtos.EmailDTO;
import br.edu.atitus.auth_service.dtos.SignupDTO;
import br.edu.atitus.auth_service.dtos.SignupResponseDTO;
import br.edu.atitus.auth_service.dtos.UserProfileDTO;
import br.edu.atitus.auth_service.entities.UserAuthEntity;
import br.edu.atitus.auth_service.entities.UserType;
import br.edu.atitus.auth_service.exceptions.InvalidDataException;
import br.edu.atitus.auth_service.exceptions.ResourceAlreadyExistsException;
import br.edu.atitus.auth_service.exceptions.ResourceNotFoundException;
import br.edu.atitus.auth_service.exceptions.ServiceCommunicationException;
import br.edu.atitus.auth_service.repositories.UserAuthRepository;
import feign.FeignException;

@Service
public class UserAuthService implements UserDetailsService {
	private final UserAuthRepository userAuthRepository;
	private final PasswordEncoder encoder;
	private final UserServiceClient userServiceClient;
	private final BookServiceClient bookServiceClient;

	public UserAuthService(UserAuthRepository userAuthRepository, PasswordEncoder encoder,
			UserServiceClient userServiceClient, BookServiceClient bookServiceClient) {
		super();
		this.userAuthRepository = userAuthRepository;
		this.encoder = encoder;
		this.userServiceClient = userServiceClient;
		this.bookServiceClient = bookServiceClient;
	}

	private void validateEmail(String email) {
		if (email == null || email.isEmpty() || !EmailValidator.validateEmail(email.trim()))
			throw new InvalidDataException("E-mail informado inválido");
	}

	private void validatePassword(String password) {
		if (password == null || password.isEmpty() || !PasswordValidator.validatePassword(password.trim()))
			throw new InvalidDataException("Senha informada inválida");
	}

	private void validateEmailUniquenessWithIdNull(String email) {

		if (userAuthRepository.existsByEmail(email.trim()))
			throw new ResourceAlreadyExistsException("Já existe usuário com este e-mail");
	}

	private void validateEmailUniquenessWithIdNotNull(UUID id, String email) {

		if (userAuthRepository.existsByEmailAndIdNot(email, id))
			throw new ResourceAlreadyExistsException("Já existe usuário com este e-mail");
	}

	private void validateUserType(Integer userType) {
		if (userType != 0 && userType != 1)
			throw new SecurityException("Usuário sem permissão");
	}

	private void validateUserTypeAndById(UUID id, UUID UserId, Integer userType) {

		if (userType != 0 && !id.equals(UserId))
			throw new SecurityException("Você não está autorizado a modificar dados de outros usuários");
	}

	private UserAuthEntity findUserById(UUID id) {
		return userAuthRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserAuthEntity user = userAuthRepository.findByEmail(username.trim())
				.orElseThrow(() -> new UsernameNotFoundException("Conta do usuário não encontrado"));
		return user;
	}

	@Transactional
	public SignupResponseDTO registerAccount(SignupDTO dto) {
		UserAuthEntity authUser = new UserAuthEntity();
		authUser.setEmail(dto.email());
		authUser.setPassword(dto.password());
		authUser.setType(UserType.Common);

		validateEmail(authUser.getEmail());
		validateEmailUniquenessWithIdNull(authUser.getEmail());
		validatePassword(authUser.getPassword());

		authUser.setPassword(encoder.encode(authUser.getPassword().trim()));
		UserAuthEntity savedUser = userAuthRepository.save(authUser);

		UUID newUserId = savedUser.getId();

		UserProfileDTO profileData = new UserProfileDTO(newUserId, dto.name(), dto.phoneNumber(), dto.cpf(),
				dto.dateOfBirth());

		try {
			userServiceClient.createProfile(profileData);

		} catch (FeignException e) {

			if (e.status() >= 400 && e.status() < 500) {
				throw new InvalidDataException("Informação(ões) inválidas:" + e.contentUTF8());

			} else {
				throw new ServiceCommunicationException("Erro na comunicação entre os serviços", e);
			}

		} catch (Exception e) {
			throw new ServiceCommunicationException("Erro inesperado, tente novamente mais tarde", e);
		}

		return new SignupResponseDTO(savedUser.getId(), dto.name(), savedUser.getEmail(), savedUser.getType(),
				dto.cpf(), dto.phoneNumber(), dto.dateOfBirth(), savedUser.getAuthorities(), savedUser.isEnabled(),
				savedUser.isAccountNonLocked(), savedUser.isAccountNonExpired(), savedUser.isCredentialsNonExpired());
	}

	@Transactional
	public CredentialsUpdateDTO updateAccount(UUID id, CredentialsUpdateDTO dto, UUID UserId, Integer userType) {
		UserAuthEntity authUser = findUserById(id);

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		if (dto.email() != null && !dto.email().isEmpty() && !dto.email().equals(authUser.getEmail())) {

			validateEmail(dto.email());
			validateEmailUniquenessWithIdNotNull(id, dto.email());
			authUser.setEmail(dto.email().trim());
		}

		if (dto.password() != null && !dto.password().isEmpty()) {

			validatePassword(dto.password());
			authUser.setPassword(encoder.encode(dto.password().trim()));

		}

		UserAuthEntity savedAuth = userAuthRepository.save(authUser);

		return new CredentialsUpdateDTO(savedAuth.getEmail(), null);
	}

	@Transactional
	public EmailDTO getUserEmail(UUID id, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		UserAuthEntity authUser = findUserById(id);

		String userEmail = authUser.getEmail();

		return new EmailDTO(userEmail);
	}

	public void deleteUserAccount(UUID id, UUID UserId, Integer userType) {

		validateUserType(userType);
		validateUserTypeAndById(id, UserId, userType);

		try {
			bookServiceClient.deleteAccount(id);

		} catch (FeignException e) {

			if (e.status() == 404) {

			} else {
				throw new ServiceCommunicationException("Erro na comunicação entre os serviços", e);
			}

		} catch (Exception e) {
			throw new ServiceCommunicationException("Erro inesperado, tente novamente mais tarde", e);
		}

		try {
			userServiceClient.deleteAccount(id);

		} catch (FeignException e) {

			if (e.status() == 404) {

			} else {
				throw new ServiceCommunicationException("Erro na comunicação entre os serviços", e);
			}

		} catch (Exception e) {
			throw new ServiceCommunicationException("Erro inesperado, tente novamente mais tarde", e);
		}

		try {
			
			if (userAuthRepository.existsById(id)) {
			userAuthRepository.deleteById(id);
			
			} else {
				
			}
		} catch (Exception e) {
			throw new RuntimeException("Erro ao deletar conta");
		}
	}

}
