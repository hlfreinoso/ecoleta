import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        const points = await knex('points')
            .join('point_items', 'points.poi_id', '=', 'point_items.poi_id')
            .whereIn('point_items.ite_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
        
        return response.json({ points });
    };

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('poi_id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found' })
        }
        else
        {
            const items = await knex('items')
                .join('point_items', 'items.ite_id', '=', 'point_items.ite_id')
                .where('point_items.poi_id', id)
                .select('items.title');
            
            return response.json({ point, items });
        }
    };

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();

        const point = {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
    
        const insertedIds = await trx('points').insert(point);
    
        const poi_id = insertedIds[0];
    
        const pointItems = items.map((ite_id: number) => {
            return {
                ite_id,
                poi_id
            };
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return response.json({
            id: poi_id,
            ...point
        });
    };
};

export default PointsController;