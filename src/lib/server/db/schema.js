import { date } from 'drizzle-orm/mysql-core';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  email: text('email').notNull(),
  nickname: text('nickname').notNull(),
  jmeno: text('jmeno').notNull(),
  prijmeni: text('prijmeni').notNull(),
  datum_nar: date('datum_nar').notNull(),
  password_hash: text('password_hash').notNull(),
  token: text('token'),
  token_expires: text('token_expires'), // ISO 8601
  is_email_verified: integer('is_email_verified').notNull(), // 0 nebo 1
  is_online: integer('is_online').notNull(), // 0 nebo 1
  created_at: text('created_at').notNull(), // ISO 8601
  update_at: text('update_at').notNull(), // ISO 8601
  profile_image: text('profile_image').notNull(),
});



export const poradce = sqliteTable('poradce', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  otazka: text('otazka').notNull(),
  odpoved: text('odpoved').notNull(),
  typ: text('typ').notNull(), // "nad" nebo "pod"
  tema: text('tema').notNull()
});


