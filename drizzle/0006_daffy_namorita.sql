CREATE TABLE `poradce` (
	`id` integer PRIMARY KEY NOT NULL,
	`otazka` text NOT NULL,
	`odpoved` text NOT NULL,
	`typ` text NOT NULL,
	`tema` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user` ADD `jmeno` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `prijmeni` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `datum_nar` date NOT NULL;