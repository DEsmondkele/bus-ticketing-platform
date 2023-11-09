export interface Ticket {
    price: any;
    ticketNumber: string;
    dateAndTime: string;
    passengerName: string;
  }
//   /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function (knex) {
//   return Promise.all([
//     knex.schema.createTable('users', function (table) {
//       table.increments('id').primary();
//       table.string('username').notNullable();
//       table.string('password').notNullable();
//       table.float('balance').notNullable();
//     }),
//     knex.schema.createTable('tickets', function (table) {
//       table.increments('id').primary();
//       table.string('ticketNumber').notNullable();
//       table.string('dateAndTime').notNullable();
//       table.string('passengerName').notNullable();
//     })
//   ]);
// };

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.down = function(knex) {
//    return knex.schema.dropTable('users');
// };