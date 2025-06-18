import { relations } from "drizzle-orm";
import {int, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").notNull(),
  billingCycle: text("billing_cycle").notNull(), // "monthly" | "yearly" | "weekly"
  nextBillingDate: integer("next_billing_date").notNull(), // ISO string
  isActive: int("is_active").default(1).notNull(), // 1 for true, 0 for false
  createdAt: integer("created_at").notNull(), // Timestamp
  updatedAt: integer("updated_at").notNull(), // Timestamp
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at").notNull(), // Timestamp
  updatedAt: integer("updated_at").notNull(), // Timestamp
  name: text("name"),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

