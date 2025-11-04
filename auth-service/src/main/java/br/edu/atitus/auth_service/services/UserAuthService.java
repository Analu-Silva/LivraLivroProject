package br.edu.atitus.auth_service.services;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import br.edu.atitus.auth_service.repositories.UserAuthRepository;

@Service
public class UserAuthService implements UserDetailsService {
	private final UserAuthRepository userAuthRepository;
	private final PasswordEncoder encoder;
	private final UserServiceClient userServiceClient;

	public UserAuthService(UserAuthRepository userAuthRepository, PasswordEncoder encoder,
			UserServiceClient userServiceClient) {
		super();
		this.userAuthRepository = userAuthRepository;
		this.encoder = encoder;
		this.userServiceClient = userServiceClient;
	}

	private void validate(UserAuthEntity user) throws Exception {

		if (user.getEmail() == null || user.getEmail().isEmpty()
				|| !EmailValidator.validateEmail(user.getEmail().trim()))
			throw new Exception("E-mail informado inválido");

		if (user.getPassword() == null || user.getPassword().isEmpty()
				|| !PasswordValidator.validatePassword(user.getPassword().trim()))
			throw new Exception("Senha informada inválida");

		if (user.getId() != null) {
			if (userAuthRepository.existsByEmailAndIdNot(user.getEmail(), user.getId()))
				throw new Exception("Já existe usuário com este e-mail");
		} else {

			if (userAuthRepository.existsByEmail(user.getEmail().trim()))
				throw new Exception("Já existe usuário com este e-mail");
		}
	}

	private void format(UserAuthEntity user) throws Exception {
		user.setPassword(encoder.encode(user.getPassword().trim()));
	}

	@Transactional
	public UserAuthEntity save(UserAuthEntity user) throws Exception {
		if (user == null)
			throw new Exception("Objeto nulo");
		validate(user);
		format(user);
		return userAuthRepository.save(user);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		var user = userAuthRepository.findByEmail(username.trim())
				.orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com este e-mail"));
		return user;
	}

	@Transactional
	public SignupResponseDTO register(SignupDTO dto) throws Exception {
		UserAuthEntity authUser = new UserAuthEntity();
		authUser.setEmail(dto.email());
		authUser.setPassword(dto.password());
		authUser.setType(UserType.Common);

		UserAuthEntity savedUser = save(authUser);
		UUID newUserId = savedUser.getId();

		UserProfileDTO profileData = new UserProfileDTO(newUserId, dto.name(), dto.phoneNumber(), dto.cpf(),
				dto.dateOfBirth());

		try {
			userServiceClient.createProfile(profileData);

		} catch (Exception e) {
			throw new RuntimeException("Não foi possível fazer o cadastro");
		}
		return new SignupResponseDTO(savedUser.getId(), dto.name(), savedUser.getEmail(), savedUser.getType(),
				dto.cpf(), dto.phoneNumber(), dto.dateOfBirth(), savedUser.getAuthorities(), savedUser.isEnabled(),
				savedUser.isAccountNonLocked(), savedUser.isAccountNonExpired(), savedUser.isCredentialsNonExpired());
	}

	@Transactional
	public CredentialsUpdateDTO updateAccount(UUID id, CredentialsUpdateDTO dto) throws Exception {
		UserAuthEntity authUser = userAuthRepository.findById(id)
				.orElseThrow(() -> new Exception("Usuário não encontrado"));

		if (dto.email() != null && !dto.email().isEmpty() && !dto.email().equals(authUser.getEmail())) {

			if (!EmailValidator.validateEmail(dto.email().trim()))
				throw new Exception("E-mail informado inválido");
			if (userAuthRepository.existsByEmailAndIdNot(dto.email().trim(), id))
				throw new Exception("Já existe usuário com este email");

			authUser.setEmail(dto.email().trim());
		}

		if (dto.password() != null && !dto.password().isEmpty()) {

			if (!PasswordValidator.validatePassword(dto.password().trim())) {
				throw new Exception("Senha informada inválida");
			}

			authUser.setPassword(encoder.encode(dto.password().trim()));

		}

		UserAuthEntity savedAuth = userAuthRepository.save(authUser);

		return new CredentialsUpdateDTO(savedAuth.getEmail(), null);
	}

	@Transactional
	public EmailDTO getUserEmail(UUID id) throws Exception {
		UserAuthEntity authUser = userAuthRepository.findById(id)
				.orElseThrow(() -> new Exception("Usuário não encontrado"));

		String userEmail = authUser.getEmail();

		return new EmailDTO(userEmail);
	}

}
