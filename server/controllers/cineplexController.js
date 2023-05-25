require('dotenv').config();
import { Cineplex, Cinema } from '../models';
import multer from 'multer';

let upload = multer({ storage: multer.memoryStorage() }).single('image');

const create = (req, res, next) => {
    try {
        upload(req, res, async(err) => {
            if (err) return res.send({ error: err.message });
            
            const { name, address, image, googleMapsUrl } = req.body;

            const newCineplex = await Cineplex.create({
                name,
                address,
                image,
                googleMapsUrl,
            });

            if (newCineplex) {
                return res.status(200).send({ message: 'Success' });
            } else {
                return res.status(400).send({ message: 'Fail' });
            }
        });

    } catch (error) {
        next(error);
    }
};

const getAll = async(req, res, next) => {
    try {
        const cineplexs = await Cineplex.findAll({
            order: [
                ['id', 'ASC']
            ],
            include: [{ model: Cinema }],
        });
        return res.status(200).send({
            cineplexs,
        });
    } catch (error) {
        next(error);
    }
};

const getById = async(req, res, next) => {
    try {
        const { id } = req.params;
        const cineplex = await Cineplex.findByPk(id);
        if (cineplex) {
            return res.status(200).send({ cineplex });
        } else {
            return res.status(400).send({ error: 'Cineplex not found' });
        }
    } catch (error) {
        next(error);
    }
};

const update = async(req, res, next) => {
    try {
        const { id } = req.params;
        const cineplex = await Cineplex.findByPk(id);
        if (cineplex) {
            upload(req, res, async(err) => {
                const { name, address, image, googleMapsUrl } = req.body;

                const parserData = {
                    name,
                    address,
                    image,
                    googleMapsUrl,
                };
                if (err) return res.send({ error: err.message });
               
                await cineplex.update(parserData);
                return res.status(200).send({ message: 'Updated' });
                
            });
        } else {
            return res.status(400).send({ error: 'Cineplex not found' });
        }
    } catch (error) {
        next(error);
    }
};

const remove = async(req, res, next) => {
    try {
        const { id } = req.params;
        const cineplex = await Cineplex.findByPk(id);
        if (cineplex) {
            await cineplex.destroy();
            return res.status(200).send({ message: 'Deleted' });
        } else {
            return res.status(400).send({ error: 'Cineplex not found' });
        }
    } catch (error) {
        next(error);
    }
};

export { create, getAll, getById, update, remove };