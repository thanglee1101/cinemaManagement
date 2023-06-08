import { User } from '../models';
import multer from 'multer';


let upload = multer({ storage: multer.memoryStorage() }).single('avatar');

const getProfile = async(req, res) => {
    const { id } = req.auth;
    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'fullname', 'birthday', 'phone', 'email', 'address', 'avatar'],
        });
        if (user) {
            return res.status(200).send({ user });
        } else {
            return res.status(200).send({ error: 'User not found!' });
        }
    } catch (error) {
        return res.status(400).send({
            error: 'Something went wrong!',
        });
    }
};

const updateProfile = async(req, res, next) => {
    try {
        const { id } = req.auth;
        const user = await User.findByPk(id);
        if (user) {
            upload(req, res, async(err) => {
                const { fullname, birthday, phone, email, address } = req.body;

                const parserData = {
                    fullname,
                    birthday,
                    phone,
                    email,
                    address,
                };
                if (err) return res.send({ error: err.message });

                await user.update(parserData);
                return res.status(200).send({ message: 'Updated' });

            });
        } else {
            return res.status(400).send({ error: 'User not found!' });
        }
    } catch (error) {
        return res.status(400).send({
            error: 'Something went wrong!',
        });
    }
};

export { getProfile, updateProfile };