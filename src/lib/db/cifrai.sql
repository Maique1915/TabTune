-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 08/02/2026 às 22:25
-- Versão do servidor: 10.11.14-MariaDB-0ubuntu0.24.04.1
-- Versão do PHP: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `cifrai`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `chord_shapes`
--

CREATE TABLE `chord_shapes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'e.g., "C Major Open", "G Barre 3rd Fret"',
  `chord_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'JSON object with frets, fingers, and barre definitions' CHECK (json_valid(`chord_data`)),
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Optional tags for searching (e.g., ["jazz", "open", "barre"])' CHECK (json_valid(`tags`)),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_one_id` bigint(20) UNSIGNED NOT NULL,
  `user_two_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `screen_context` enum('short','full','beats') DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Complete project data: measures, settings, theme' CHECK (json_valid(`data`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `projects`
--

INSERT INTO `projects` (`id`, `user_id`, `screen_context`, `name`, `data`, `created_at`, `updated_at`) VALUES
(1, 1, 'short', 'Arte', '{\"version\":1,\"chords\":[{\"chord\":{\"note\":0,\"complement\":0,\"extension\":[],\"bass\":0},\"origin\":0,\"fingers\":{\"2\":[1,1],\"4\":[2,2],\"5\":[3,3]},\"avoid\":[],\"chordName\":\"C\",\"capo\":0,\"extends\":{\"durationMs\":2000,\"measureId\":\"rhhkrkgss\"}},{\"chord\":{\"note\":5,\"complement\":0,\"extension\":[],\"bass\":0},\"origin\":5,\"fingers\":{\"3\":[2,2],\"4\":[3,4],\"5\":[3,3],\"6\":[1,1]},\"avoid\":[],\"chordName\":\"F\",\"capo\":0,\"extends\":{\"durationMs\":2000,\"measureId\":\"cv966nqjj\"}},{\"chord\":{\"note\":7,\"complement\":0,\"extension\":[],\"bass\":0},\"origin\":7,\"fingers\":{\"3\":[4,2],\"4\":[5,4],\"5\":[5,3],\"6\":[3,1]},\"avoid\":[],\"chordName\":\"G\",\"capo\":0,\"extends\":{\"durationMs\":2000,\"measureId\":\"cn40gnen6\"}}],\"measures\":[{\"id\":\"rhhkrkgss\",\"isCollapsed\":false,\"showClef\":false,\"showTimeSig\":false,\"notes\":[{\"id\":\"2jsckcvhs\",\"duration\":\"q\",\"type\":\"note\",\"decorators\":{\"dot\":false},\"positions\":[{\"fret\":1,\"string\":2,\"avoid\":false,\"finger\":1},{\"fret\":2,\"string\":4,\"avoid\":false,\"finger\":2},{\"fret\":3,\"string\":5,\"avoid\":false,\"finger\":3}],\"technique\":\"\",\"isSlurred\":false,\"accidental\":\"none\"}],\"chordName\":\"C\"},{\"id\":\"cv966nqjj\",\"isCollapsed\":false,\"showClef\":true,\"showTimeSig\":true,\"notes\":[{\"id\":\"qqv2nt7bq\",\"positions\":[{\"fret\":1,\"string\":6,\"avoid\":false,\"finger\":1,\"endString\":1},{\"fret\":3,\"string\":5,\"avoid\":false,\"finger\":3},{\"fret\":3,\"string\":4,\"avoid\":false,\"finger\":4},{\"fret\":2,\"string\":3,\"avoid\":false,\"finger\":2}],\"duration\":\"q\",\"type\":\"note\",\"decorators\":{\"dot\":false},\"accidental\":\"none\"}],\"chordName\":\"F\"},{\"id\":\"cn40gnen6\",\"isCollapsed\":false,\"showClef\":true,\"showTimeSig\":true,\"notes\":[{\"id\":\"ywvui9syx\",\"positions\":[{\"fret\":3,\"string\":6,\"avoid\":false,\"finger\":1,\"endString\":1},{\"fret\":5,\"string\":5,\"avoid\":false,\"finger\":3},{\"fret\":5,\"string\":4,\"avoid\":false,\"finger\":4},{\"fret\":4,\"string\":3,\"avoid\":false,\"finger\":2}],\"duration\":\"q\",\"type\":\"note\",\"decorators\":{\"dot\":false},\"accidental\":\"none\"}],\"chordName\":\"G\"}],\"settings\":{\"clef\":\"tab\",\"key\":\"C\",\"time\":\"4/4\",\"bpm\":120,\"showNotation\":true,\"showTablature\":true,\"instrumentId\":\"violao\",\"tuningIndex\":0,\"capo\":0,\"tuningShift\":0,\"numFrets\":5},\"theme\":{\"global\":{\"backgroundColor\":\"#000000\",\"primaryTextColor\":\"#FF8C42\",\"scale\":1,\"rotation\":0,\"mirror\":false},\"fretboard\":{\"neck\":{\"color\":\"#303135\",\"opacity\":1,\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5}},\"frets\":{\"color\":\"#000000\",\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":3}},\"strings\":{\"color\":\"#FFFFFF\",\"thickness\":3,\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":3}},\"board\":{\"inlays\":{\"color\":\"rgba(0, 0, 0, 0.35)\",\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":3}}}},\"fingers\":{\"color\":\"#200f0f\",\"textColor\":\"#ffffff\",\"border\":{\"color\":\"#FFFFFF\",\"width\":4},\"opacity\":0.9,\"shadow\":{\"enabled\":true,\"color\":\"rgba(0,0,0,0.6)\",\"blur\":8},\"radius\":22,\"fontSize\":16,\"barreWidth\":48,\"barreFingerRadius\":22},\"arrows\":{\"color\":\"#FF8C42\",\"textColor\":\"#000000\",\"border\":{\"color\":\"#FFFFFF\",\"width\":2},\"shadow\":{\"enabled\":true,\"color\":\"rgba(255, 140, 66, 0.5)\",\"blur\":10}},\"chordName\":{\"color\":\"#ffffff\",\"textColor\":\"#ffffff\",\"opacity\":1,\"shadow\":{\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5,\"enabled\":true},\"stroke\":{\"color\":\"#000000\",\"width\":0},\"fontSize\":35,\"extSize\":24},\"capo\":{\"color\":\"rgba(100, 100, 110, 0.9)\",\"border\":{\"color\":\"rgba(0, 0, 0, 0.3)\",\"width\":1},\"textColors\":{\"name\":\"#ffffff\",\"number\":\"#FF8C42\"},\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5}},\"avoid\":{\"color\":\"#ffffff\",\"lineWidth\":6,\"size\":15,\"opacity\":0.9,\"border\":{\"color\":\"#000000\",\"width\":2}},\"head\":{\"color\":\"#3a3a3e\",\"textColors\":{\"name\":\"#FF8C42\"},\"border\":{\"color\":\"#3a3a3e\",\"width\":0},\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5}}}}', '2026-02-08 04:24:01', '2026-02-08 20:05:00'),
(2, 1, 'short', 'teste', '{\"version\":1,\"chords\":[{\"chord\":{\"note\":0,\"complement\":0,\"extension\":[],\"bass\":0},\"origin\":0,\"fingers\":{\"6\":[1,1]},\"avoid\":[],\"chordName\":\"\",\"capo\":0,\"extends\":{\"durationMs\":2000,\"measureId\":\"5mt1d7v2i\"}}],\"measures\":[{\"id\":\"5mt1d7v2i\",\"isCollapsed\":false,\"showClef\":true,\"showTimeSig\":true,\"notes\":[{\"id\":\"bxhll0lze\",\"positions\":[{\"fret\":1,\"string\":6,\"avoid\":false,\"finger\":1}],\"duration\":\"q\",\"type\":\"note\",\"decorators\":{\"dot\":false},\"accidental\":\"none\"}]}],\"settings\":{\"clef\":\"tab\",\"key\":\"C\",\"time\":\"4/4\",\"bpm\":120,\"showNotation\":true,\"showTablature\":true,\"instrumentId\":\"violao\",\"tuningIndex\":0,\"capo\":0,\"tuningShift\":0,\"numFrets\":5},\"theme\":{\"global\":{\"backgroundColor\":\"#000000\",\"primaryTextColor\":\"#FF8C42\",\"scale\":1,\"rotation\":0,\"mirror\":false},\"fretboard\":{\"neck\":{\"color\":\"#303135\",\"opacity\":1,\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5}},\"frets\":{\"color\":\"#000000\",\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":3}},\"strings\":{\"color\":\"#FFFFFF\",\"thickness\":3,\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":3}},\"board\":{\"inlays\":{\"color\":\"rgba(0, 0, 0, 0.35)\",\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":3}}}},\"fingers\":{\"color\":\"#200f0f\",\"textColor\":\"#ffffff\",\"border\":{\"color\":\"#FFFFFF\",\"width\":4},\"opacity\":0.9,\"shadow\":{\"enabled\":true,\"color\":\"rgba(0,0,0,0.6)\",\"blur\":8},\"radius\":22,\"fontSize\":16,\"barreWidth\":48,\"barreFingerRadius\":22},\"arrows\":{\"color\":\"#FF8C42\",\"textColor\":\"#000000\",\"border\":{\"color\":\"#FFFFFF\",\"width\":2},\"shadow\":{\"enabled\":true,\"color\":\"rgba(255, 140, 66, 0.5)\",\"blur\":10}},\"chordName\":{\"color\":\"#ffffff\",\"textColor\":\"#ffffff\",\"opacity\":1,\"shadow\":{\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5,\"enabled\":true},\"stroke\":{\"color\":\"#000000\",\"width\":0},\"fontSize\":35,\"extSize\":24},\"capo\":{\"color\":\"rgba(100, 100, 110, 0.9)\",\"border\":{\"color\":\"rgba(0, 0, 0, 0.3)\",\"width\":1},\"textColors\":{\"name\":\"#ffffff\",\"number\":\"#FF8C42\"},\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5}},\"avoid\":{\"color\":\"#ffffff\",\"lineWidth\":6,\"size\":15,\"opacity\":0.9,\"border\":{\"color\":\"#000000\",\"width\":2}},\"head\":{\"color\":\"#3a3a3e\",\"textColors\":{\"name\":\"#FF8C42\"},\"border\":{\"color\":\"#3a3a3e\",\"width\":0},\"shadow\":{\"enabled\":false,\"color\":\"rgba(0,0,0,0.5)\",\"blur\":5}}}}', '2026-02-08 20:08:59', '2026-02-08 20:08:59');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nivel` enum('free','plus','admin') NOT NULL DEFAULT 'free',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `preferred_language` enum('en','pt','es') DEFAULT 'en',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `nivel`, `name`, `email`, `password_hash`, `preferred_language`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'maique pereira', 'maique1915@gmail.com', '$2b$10$tu0w82QMLGsc8i3T501hY.qvZHELsK2ZH1I6eXrT29UhdxGhwu7oe', 'pt', '2026-02-08 01:51:53', '2026-02-08 21:28:34');

-- --------------------------------------------------------

--
-- Estrutura para tabela `user_history`
--

CREATE TABLE `user_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `screen_context` enum('short','full','beats') NOT NULL,
  `last_history_index` int(11) NOT NULL DEFAULT 0 COMMENT 'Pointer to the last undo/redo stack index',
  `last_state_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Optional: Full state snapshot for advanced restore' CHECK (json_valid(`last_state_snapshot`)),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `user_styles`
--

CREATE TABLE `user_styles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `screen_context` enum('short','full','beats') NOT NULL,
  `style_name` varchar(100) NOT NULL,
  `style_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'JSON object containing style properties (colors, dimensions, etc.)' CHECK (json_valid(`style_config`)),
  `is_active` tinyint(1) DEFAULT 0 COMMENT 'Flags if this is the currently selected style for the context',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `chord_shapes`
--
ALTER TABLE `chord_shapes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_chord` (`user_id`,`name`);

--
-- Índices de tabela `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_pair` (`user_one_id`,`user_two_id`),
  ADD KEY `fk_conv_user_two` (`user_two_id`);

--
-- Índices de tabela `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversation` (`conversation_id`),
  ADD KEY `fk_msg_sender` (`sender_id`);

--
-- Índices de tabela `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_projects` (`user_id`,`created_at`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Índices de tabela `user_history`
--
ALTER TABLE `user_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_user_screen` (`user_id`,`screen_context`);

--
-- Índices de tabela `user_styles`
--
ALTER TABLE `user_styles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_context` (`user_id`,`screen_context`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `chord_shapes`
--
ALTER TABLE `chord_shapes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `user_history`
--
ALTER TABLE `user_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_styles`
--
ALTER TABLE `user_styles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `chord_shapes`
--
ALTER TABLE `chord_shapes`
  ADD CONSTRAINT `chord_shapes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `fk_conv_user_one` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_conv_user_two` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_msg_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `user_history`
--
ALTER TABLE `user_history`
  ADD CONSTRAINT `user_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `user_styles`
--
ALTER TABLE `user_styles`
  ADD CONSTRAINT `user_styles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
