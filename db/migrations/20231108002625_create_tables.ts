import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
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

      // Define the foreign key relationship
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
    knex.schema.dropTableIfExists("ticket"),
    knex.schema.dropTableIfExists("user"),
  ]);
}
