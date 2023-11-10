import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
    knex.schema.createTable("transaction", (table) => {
      table.increments("id").primary();
      table.integer("from_user_id").unsigned().notNullable();
      table.integer("to_user_id").unsigned().notNullable();
      table.integer("amount").notNullable();
      table.string("date").notNullable();

      table
        .foreign("from_user_id")
        .references("id")
        .inTable("user")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table
        .foreign("to_user_id")
        .references("id")
        .inTable("user")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    }),
    knex.schema.createTable("user", (table) => {
      table.increments("id").primary();
      table.string("username").notNullable();
      table.string("password").notNullable();
      table.integer("balance").notNullable();
    }),

    knex.schema.createTable("ticket", (table) => {
      table.increments("id").primary();
      table.string("ticketNumber").notNullable();
      table.string("dateAndTime").notNullable();
      table.string("passengerName").notNullable();
      table.integer("price").notNullable();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("user")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    }),

  ]);
}

export async function down(knex: Knex): Promise<void> {
  await Promise.all([
    knex.schema.dropTableIfExists("transaction"),
    knex.schema.dropTableIfExists("ticket"),
    knex.schema.dropTableIfExists("user"),
  ]);
}
