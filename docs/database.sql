-- =============================================
-- PC GEAR STORE DATABASE
-- MySQL 8.0+ | UTF-8 Unicode
-- =============================================

CREATE DATABASE IF NOT EXISTS pcgear_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pcgear_store;

-- users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  role ENUM('admin', 'customer') DEFAULT 'customer',
  address VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(30) NOT NULL UNIQUE,
  label VARCHAR(50) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'fa-tag',
  slug VARCHAR(50) NOT NULL UNIQUE,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB;

-- brands
CREATE TABLE brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  logo VARCHAR(255) DEFAULT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  brand_id INT NOT NULL,
  price INT UNSIGNED NOT NULL,
  old_price INT UNSIGNED DEFAULT NULL,
  image VARCHAR(255) NOT NULL DEFAULT 'assets/img/default.svg',
  badge ENUM('new', 'hot', 'sale', 'bestseller') DEFAULT NULL,
  badge_text VARCHAR(30) DEFAULT NULL,
  spec_short VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  stock INT UNSIGNED DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INT UNSIGNED DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- product_images
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- product_specs
CREATE TABLE product_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  spec_key VARCHAR(50) NOT NULL,
  spec_value VARCHAR(200) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- cart_items
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT UNSIGNED DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cart (user_id, product_id)
) ENGINE=InnoDB;

-- wishlists
CREATE TABLE wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_wishlist (user_id, product_id)
) ENGINE=InnoDB;

-- coupons
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  discount_percent INT NOT NULL,
  min_order_value INT UNSIGNED DEFAULT 0,
  max_discount INT UNSIGNED DEFAULT NULL,
  usage_limit INT DEFAULT NULL,
  used_count INT DEFAULT 0,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_code VARCHAR(20) NOT NULL UNIQUE,
  subtotal INT UNSIGNED NOT NULL,
  shipping_fee INT UNSIGNED DEFAULT 0,
  discount INT UNSIGNED DEFAULT 0,
  total INT UNSIGNED NOT NULL,
  coupon_id INT DEFAULT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(15) NOT NULL,
  receiver_address TEXT NOT NULL,
  payment_method ENUM('cod', 'banking', 'momo') DEFAULT 'cod',
  status ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending',
  note TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- order_items
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  price INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- reviews
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT DEFAULT NULL,
  rating TINYINT NOT NULL,
  comment TEXT DEFAULT NULL,
  is_approved TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- blog_posts
CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  excerpt TEXT DEFAULT NULL,
  content LONGTEXT DEFAULT NULL,
  category VARCHAR(50) NOT NULL,
  author_id INT NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  read_time INT DEFAULT NULL,
  is_published TINYINT(1) DEFAULT 0,
  published_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB;


-- =============================================
-- DU LIEU MAU (SEED DATA)
-- =============================================

-- Admin mac dinh (password: admin123 -> doi lai khi deploy)
INSERT INTO users (fullname, email, password, role) VALUES
('Admin', 'admin@pcgear.vn', '$2y$10$hashedPasswordHere', 'admin');

-- Categories
INSERT INTO categories (key_name, label, icon, slug, sort_order) VALUES
('CPU', 'Bộ xử lý', 'fa-microchip', 'bo-xu-ly', 1),
('GPU', 'Card đồ họa', 'fa-display', 'card-do-hoa', 2),
('Mainboard', 'Bo mạch chủ', 'fa-server', 'bo-mach-chu', 3),
('RAM', 'Bộ nhớ RAM', 'fa-memory', 'bo-nho-ram', 4),
('SSD', 'Ổ cứng SSD', 'fa-hard-drive', 'o-cung-ssd', 5),
('PSU', 'Nguồn máy tính', 'fa-bolt', 'nguon-may-tinh', 6),
('Case', 'Vỏ máy tính', 'fa-computer', 'vo-may-tinh', 7),
('Cooling', 'Tản nhiệt', 'fa-fan', 'tan-nhiet', 8),
('Monitor', 'Màn hình', 'fa-tv', 'man-hinh', 9),
('Mouse', 'Chuột gaming', 'fa-computer-mouse', 'chuot-gaming', 10),
('Keyboard', 'Bàn phím cơ', 'fa-keyboard', 'ban-phim-co', 11),
('Headset', 'Tai nghe', 'fa-headphones', 'tai-nghe', 12);

-- Brands
INSERT INTO brands (name, slug) VALUES
('Intel', 'intel'), ('AMD', 'amd'), ('NVIDIA', 'nvidia'),
('ASUS', 'asus'), ('MSI', 'msi'), ('Gigabyte', 'gigabyte'),
('Corsair', 'corsair'), ('G.Skill', 'gskill'), ('Kingston', 'kingston'),
('Samsung', 'samsung'), ('Lexar', 'lexar'), ('Logitech', 'logitech'),
('Razer', 'razer'), ('HyperX', 'hyperx'), ('SteelSeries', 'steelseries'),
('Akko', 'akko'), ('DeepCool', 'deepcool'), ('Jonsbo', 'jonsbo'),
('Xigmatek', 'xigmatek'), ('LG', 'lg'), ('Kuycon', 'kuycon');

-- Coupon mau
INSERT INTO coupons (code, discount_percent, min_order_value, max_discount, usage_limit, valid_from, valid_to) VALUES
('PCGEAR10', 10, 5000000, 2000000, 100, '2026-01-01', '2026-12-31');
