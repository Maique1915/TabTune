import { mysqlTable, bigint, varchar, text, timestamp, mysqlEnum, json, boolean, int, uniqueIndex } from "drizzle-orm/mysql-core";

// Users Table
export const users = mysqlTable("users", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    preferredLanguage: mysqlEnum("preferred_language", ["en", "pt", "es"]).default("en"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow().defaultNow(),
}, (table) => ({
    emailIdx: uniqueIndex("email").on(table.email),
}));

// Chord Shapes Table
export const chordShapes = mysqlTable("chord_shapes", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    chordData: json("chord_data").notNull(),
    tags: json("tags"),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    userChordIdx: uniqueIndex("idx_user_chord").on(table.userId, table.name),
}));

// Projects Table
export const projects = mysqlTable("projects", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    screenContext: mysqlEnum("screen_context", ["short", "full", "beats"]).notNull(),
    data: json("data").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow().defaultNow(),
});

// User History Table
export const userHistory = mysqlTable("user_history", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id, { onDelete: "cascade" }),
    screenContext: mysqlEnum("screen_context", ["short", "full", "beats"]).notNull(),
    lastHistoryIndex: int("last_history_index").default(0).notNull(),
    lastStateSnapshot: json("last_state_snapshot"),
    updatedAt: timestamp("updated_at").onUpdateNow().defaultNow(),
}, (table) => ({
    userScreenIdx: uniqueIndex("uk_user_screen").on(table.userId, table.screenContext),
}));

// User Styles Table
export const userStyles = mysqlTable("user_styles", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id, { onDelete: "cascade" }),
    screenContext: mysqlEnum("screen_context", ["short", "full", "beats"]).notNull(),
    styleName: varchar("style_name", { length: 100 }).notNull(),
    styleConfig: json("style_config").notNull(),
    isActive: boolean("is_active").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
