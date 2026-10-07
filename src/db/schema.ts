import { boolean, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: varchar("handle", { length: 32 }).notNull().unique(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  email: varchar("email", { length: 254 }).unique(),
  passwordHash: text("password_hash"),
  recoveryKeyHash: varchar("recovery_key_hash", { length: 64 }),
  bio: text("bio").notNull().default("Building skills, one flag at a time."),
  location: varchar("location", { length: 80 }).notNull().default("Global"),
  isGuest: boolean("is_guest").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const solves = pgTable("solves", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: varchar("challenge_id", { length: 80 }).notNull(),
  points: integer("points").notNull(),
  solvedAt: timestamp("solved_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("solves_user_challenge_idx").on(table.userId, table.challengeId)]);

export const labProgress = pgTable("lab_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("module_id", { length: 80 }).notNull(),
  completedTaskIds: jsonb("completed_task_ids").$type<string[]>().notNull().default([]),
  completed: boolean("completed").notNull().default(false),
  earnedPoints: integer("earned_points").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("lab_progress_user_module_idx").on(table.userId, table.moduleId)]);

export const quizResults = pgTable("quiz_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("module_id", { length: 80 }).notNull(),
  score: integer("score").notNull().default(0),
  total: integer("total").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("quiz_results_user_module_idx").on(table.userId, table.moduleId)]);

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: varchar("challenge_id", { length: 80 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("bookmarks_user_challenge_idx").on(table.userId, table.challengeId)]);

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 32 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull().default(""),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 60 }).notNull(),
  code: varchar("code", { length: 24 }).notNull().unique(),
  description: text("description").notNull(),
  captainId: uuid("captain_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("team_members_user_idx").on(table.userId)]);
