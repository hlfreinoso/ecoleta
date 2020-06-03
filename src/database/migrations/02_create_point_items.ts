import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();

        table.integer('poi_id')
            .notNullable()
            .references('poi_id')
            .inTable('points');
        table.integer('ite_id')
            .notNullable()
            .references('ite_id')
            .inTable('items');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('point_items');
}