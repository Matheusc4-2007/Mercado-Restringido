-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 05-11-2026 a las 23:39:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `MercadoRestringido`
--
CREATE DATABASE IF NOT EXISTS `MercadoRestringido` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE `MercadoRestringido`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` char(36) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
('12e45b40-147f-4d70-93f5-74393a38fac6', 'Ropa', 'Prendas de vestir, calzado y accesorios'),
('297ee7ac-bcca-4151-aa92-47691c2563ec', 'Belleza y cuidado personal', 'Cosméticos, perfumes e higiene personal'),
('6d2f00e7-e1ff-4f8e-b62e-910d38fb9e36', 'Hogar', 'Muebles, decoración y artículos para el hogar'),
('9b57d8e9-baa6-408f-a42f-ab1fd1a64bc2', 'Otros', 'Productos que no encajan en otra categoría'),
('b09efb6e-e6d6-4f97-b723-e908a7a537ec', 'Tecnología', 'Computadoras, celulares, audio y electrónica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` char(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(1000) NOT NULL DEFAULT '',
  `precio` decimal(10,2) NOT NULL CHECK (`precio` >= 0),
  `stock` int(11) NOT NULL DEFAULT 0 CHECK (`stock` >= 0),
  `id_vendedor` char(36) NOT NULL,
  `id_categoria` char(36) NOT NULL,
  `imagen` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `id_vendedor`, `id_categoria`, `imagen`) VALUES
('09b0afd9-bec1-4bca-b376-690d7fa348ec', 'Zapatos de cuero negro', 'Zapatos formales de cuero genuino con suela antideslizante, ideales para oficina.', 69.90, 15, '3feec41f-1b71-4c7f-ae41-1123e9ee6e4f', '12e45b40-147f-4d70-93f5-74393a38fac6', 'https://picsum.photos/seed/zapatos/400/400'),
('11adb71a-ab6f-40b1-aed1-aa3fa02642fc', 'Juego de sábanas', 'Juego de sábanas de microfibra para cama queen, suaves y resistentes al lavado.', 45.00, 20, '3feec41f-1b71-4c7f-ae41-1123e9ee6e4f', '6d2f00e7-e1ff-4f8e-b62e-910d38fb9e36', 'https://picsum.photos/seed/sabanas/400/400'),
('4349e451-d100-47bd-8792-df49435fbbb7', 'Mochila multiusos', 'Mochila resistente al agua con compartimento acolchado para laptop de hasta 15 pulgadas.', 39.90, 30, '11be480e-e969-46e2-a549-a70e34ec5067', '9b57d8e9-baa6-408f-a42f-ab1fd1a64bc2', 'https://picsum.photos/seed/mochila/400/400'),
('4e742003-de78-4042-a7b1-1c763e47207f', 'Teléfono inteligente', 'Pantalla de 6.5 pulgadas, cámara de 48 MP y carga rápida. Incluye cargador.', 329.99, 12, '11be480e-e969-46e2-a549-a70e34ec5067', 'b09efb6e-e6d6-4f97-b723-e908a7a537ec', 'https://picsum.photos/seed/telefono/400/400'),
('688263a4-0e94-4028-b9ce-c7224ceafb51', 'Camisa de algodón', 'Camisa manga larga de algodón 100%, corte regular. Disponible en varios colores.', 24.99, 49, '3feec41f-1b71-4c7f-ae41-1123e9ee6e4f', '12e45b40-147f-4d70-93f5-74393a38fac6', 'https://picsum.photos/seed/camisa/400/400'),
('6def5519-bb30-4c1d-90c7-17e3483d15d9', 'Laptop 15 pulgadas', 'Laptop con procesador de última generación, 16 GB de RAM y 512 GB de almacenamiento SSD.', 749.00, 7, '11be480e-e969-46e2-a549-a70e34ec5067', 'b09efb6e-e6d6-4f97-b723-e908a7a537ec', 'https://picsum.photos/seed/laptop/400/400'),
('e0bf49dd-018e-430d-80ef-256fcb7c4eec', 'Crema hidratante facial', 'Crema hidratante con ácido hialurónico para todo tipo de piel, 50 ml.', 18.75, 25, '3feec41f-1b71-4c7f-ae41-1123e9ee6e4f', '297ee7ac-bcca-4151-aa92-47691c2563ec', 'https://picsum.photos/seed/crema/400/400'),
('e210e331-7fac-4328-9386-37bde18c5712', 'Lámpara de mesa', 'Lámpara LED de mesa con luz cálida regulable y base de madera.', 32.00, 18, '3feec41f-1b71-4c7f-ae41-1123e9ee6e4f', '6d2f00e7-e1ff-4f8e-b62e-910d38fb9e36', 'https://picsum.photos/seed/lampara/400/400'),
('f5d44492-9872-43e3-9f97-ca2b68dd9b63', 'Audífonos inalámbricos', 'Audífonos Bluetooth con cancelación de ruido y hasta 30 horas de batería.', 59.50, 38, '11be480e-e969-46e2-a549-a70e34ec5067', 'b09efb6e-e6d6-4f97-b723-e908a7a537ec', 'https://picsum.photos/seed/audifonos/400/400');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` char(36) NOT NULL,
  `cedula` varchar(15) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `es_vendedor` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `cedula`, `nombre`, `apellido`, `fecha_nacimiento`, `es_vendedor`) VALUES
('11be480e-e969-46e2-a549-a70e34ec5067', '23456789', 'Carlos', 'Rodríguez', '1988-09-30', 1),
('1b9e463e-1f85-425f-a0fa-47428f6d375e', '0000000', 'Administrador', 'Sistema', '1990-01-01', 0),
('3feec41f-1b71-4c7f-ae41-1123e9ee6e4f', '12345678', 'María', 'Fernández', '1992-04-15', 1),
('44bbaae4-d124-4408-a97e-a5e331995325', '34567890', 'Laura', 'Gómez', '1995-12-05', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_vendedor` (`id_vendedor`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE;
-- --------------------------------------------------------
-- Entidades nuevas: pedidos, detalle_pedido, resenas y favoritos
-- --------------------------------------------------------

CREATE TABLE `pedidos` (
  `id` char(36) NOT NULL,
  `id_comprador` char(36) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `total` decimal(12,2) NOT NULL CHECK (`total` >= 0),
  `estado` enum('pendiente','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id`),
  KEY `id_comprador` (`id_comprador`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_comprador`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `detalle_pedido` (
  `id` char(36) NOT NULL,
  `id_pedido` char(36) NOT NULL,
  `id_producto` char(36) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `precio_unitario` decimal(10,2) NOT NULL CHECK (`precio_unitario` >= 0),
  PRIMARY KEY (`id`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `resenas` (
  `id` char(36) NOT NULL,
  `id_producto` char(36) NOT NULL,
  `id_usuario` char(36) NOT NULL,
  `calificacion` tinyint(4) NOT NULL CHECK (`calificacion` between 1 and 5),
  `comentario` varchar(500) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `producto_usuario` (`id_producto`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `favoritos` (
  `id` char(36) NOT NULL,
  `id_usuario` char(36) NOT NULL,
  `id_producto` char(36) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_producto` (`id_usuario`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------
-- Datos de ejemplo de pedidos, reseñas y favoritos
-- (usuario comprador: Laura Gómez, cédula 34567890)
-- --------------------------------------------------------

INSERT INTO `pedidos` (`id`, `id_comprador`, `fecha`, `total`, `estado`) VALUES
('3987a420-ac18-4c07-9f09-7cc596ef14fd', '44bbaae4-d124-4408-a97e-a5e331995325', '2026-11-02 15:30:00', 868.00, 'entregado'),
('b05395a6-687c-4ca6-ab02-85a66d35a9d9', '44bbaae4-d124-4408-a97e-a5e331995325', '2026-11-10 10:05:00', 24.99, 'pendiente');

INSERT INTO `detalle_pedido` (`id`, `id_pedido`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
('e789f0e4-1241-4017-a9be-81e20631bcae', '3987a420-ac18-4c07-9f09-7cc596ef14fd', '6def5519-bb30-4c1d-90c7-17e3483d15d9', 1, 749.00),
('5fd2cb09-c1e7-435b-a56d-64cb70f9d6b9', '3987a420-ac18-4c07-9f09-7cc596ef14fd', 'f5d44492-9872-43e3-9f97-ca2b68dd9b63', 2, 59.50),
('9342a0fc-8e98-45bb-b820-c8d2655f4211', 'b05395a6-687c-4ca6-ab02-85a66d35a9d9', '688263a4-0e94-4028-b9ce-c7224ceafb51', 1, 24.99);

INSERT INTO `resenas` (`id`, `id_producto`, `id_usuario`, `calificacion`, `comentario`, `fecha`) VALUES
('79fe04f0-a64e-43b6-9be8-c7975f48824f', '6def5519-bb30-4c1d-90c7-17e3483d15d9', '44bbaae4-d124-4408-a97e-a5e331995325', 5, 'Muy rápida y llegó bien empacada.', '2026-11-05 18:00:00'),
('5a4798d7-41e8-4d02-a13f-0d4dd2e53bc3', 'f5d44492-9872-43e3-9f97-ca2b68dd9b63', '44bbaae4-d124-4408-a97e-a5e331995325', 4, NULL, '2026-11-05 18:10:00');

INSERT INTO `favoritos` (`id`, `id_usuario`, `id_producto`, `fecha`) VALUES
('edff88f3-bc3b-4452-ba1f-a0518879fbc0', '44bbaae4-d124-4408-a97e-a5e331995325', '4e742003-de78-4042-a7b1-1c763e47207f', '2026-11-06 09:00:00'),
('8114b1c1-744c-429f-9a37-95558ec116d8', '44bbaae4-d124-4408-a97e-a5e331995325', 'e210e331-7fac-4328-9386-37bde18c5712', '2026-11-06 09:05:00');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;