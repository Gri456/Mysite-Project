-- Usa a BD criada via compose
CREATE DATABASE IF NOT EXISTS bitjourney CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bitjourney;

-- 0) Utilizadores anónimos (UUID + password hash)
CREATE TABLE IF NOT EXISTS users (
  uuid CHAR(36) PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  is_premium TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 1) Áreas temáticas
CREATE TABLE IF NOT EXISTS areas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  icon VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2) Recursos (links/PDFs) por área
CREATE TABLE IF NOT EXISTS resources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  area_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  type ENUM('pdf','link','video','article','repo') NOT NULL DEFAULT 'link',
  url TEXT NOT NULL,
  access ENUM('free','premium') NOT NULL DEFAULT 'free',
  lang VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resources_area FOREIGN KEY (area_id) REFERENCES areas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_resources_area_access (area_id, access)
) ENGINE=InnoDB;

-- 3) Favoritos do utilizador
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_uuid CHAR(36) NOT NULL,
  resource_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_resource (user_uuid, resource_id),
  CONSTRAINT fk_bm_user FOREIGN KEY (user_uuid) REFERENCES users(uuid)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_bm_res FOREIGN KEY (resource_id) REFERENCES resources(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- 5) Reset de password
CREATE TABLE IF NOT EXISTS password_resets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_uuid CHAR(36) NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pr_user FOREIGN KEY (user_uuid) REFERENCES users(uuid)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_pr_user (user_uuid, expires_at)
) ENGINE=InnoDB;

-- 6) Auditoria de logins
CREATE TABLE IF NOT EXISTS login_audit (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_uuid CHAR(36) NULL,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  success TINYINT(1) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_uuid),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_uuid) REFERENCES users(uuid)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;             explicaca me cada uma destas tabelas 