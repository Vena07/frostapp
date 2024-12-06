CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nickname` text NOT NULL,
	`password_hash` text NOT NULL,
	`token` text NOT NULL,
	`token_expires` date NOT NULL,
	`is_email_verified` boolean NOT NULL,
	`is_online` boolean NOT NULL,
	`created_at` date NOT NULL,
	`update_at` date NOT NULL,
	`profile_image` text NOT NULL
);
