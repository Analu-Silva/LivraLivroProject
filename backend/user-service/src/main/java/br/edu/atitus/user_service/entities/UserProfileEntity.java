package br.edu.atitus.user_service.entities;

import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_user_profile")
public class UserProfileEntity {

	@Id
	@Column()
	private UUID id;
	
	@Column()
	private String name;

	@Column(name = "phone_number")
	private String phoneNumber;

	@Column()
	private String cpf;

	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;
	
	//Perfil
	
	@Column(name = "user_image_url")
	private String userImageUrl;
	
	@ManyToOne
	@JoinColumn(name = "user_genre_id")
	private UserProfileGenreEntity userGenre;
	
	@Column()
	private String description;
	
	@OneToOne(mappedBy= "userProfileEntity", cascade = CascadeType.ALL)
	@JsonManagedReference
	private UserAddressEntity userAddressEntity;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getUserImageUrl() {
		return userImageUrl;
	}

	public void setUserImageUrl(String userImageUrl) {
		this.userImageUrl = userImageUrl;
	}

	public UserProfileGenreEntity getUserGenre() {
		return userGenre;
	}

	public void setUserGenre(UserProfileGenreEntity userGenre) {
		this.userGenre = userGenre;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public UserAddressEntity getUserAddressEntity() {
		return userAddressEntity;
	}

	public void setUserAddressEntity(UserAddressEntity userAddressEntity) {
		this.userAddressEntity = userAddressEntity;
	}

}
