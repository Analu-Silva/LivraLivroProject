package br.edu.atitus.auth_service.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.edu.atitus.auth_service.entities.UserAuthEntity;
import feign.Param;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuthEntity, UUID> {

	boolean existsByEmail(String email);

	boolean existsByEmailAndIdNot(String email, UUID id);

	Optional<UserAuthEntity> findByEmail(String email);
	
	@Query("SELECT user.id FROM UserAuthEntity user WHERE user.type = 1 AND user.id IN :activeSellerIds")
	List<UUID> findAllSellersAuthInfo(@Param("activeSellerIds") List<UUID> activeSellerIds);

}
