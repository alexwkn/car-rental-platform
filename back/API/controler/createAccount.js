import {ProfileValidator} from "../middleware/validator/profile.js";
import {hash} from "../../utils/hash.js";
import {sign} from "../../utils/jwt.js";
import prisma from "../../database/databaseORM.js";


export const createAccount = async (req, res) => {
    try {
        const {name, email, password, adress, bank_account, is_renter, profile_picture} = req.body;

        const validatedData = await ProfileValidator.validate({
            name,
            email,
            password,
            adress,
            bank_account,
            is_renter,
            profile_picture
        });

        console.log('createAccount - validatedData:', validatedData);

        //Hacher le mot de passe
        const hashedPassword = await hash(validatedData.password);

        const newProfile = await prisma.profile.create({
            data: {
                ...validatedData,
                password: hashedPassword
            }
        });

        //Générer un token JWT
        const token = sign({
                id: newProfile.profile_id,      
                email: newProfile.email,   
                is_renter: newProfile.is_renter      
        },
        { expiresIn: '1h' }
    );
        res.status(201).json({
            message: 'Account created successfully',
            data: {
                profile: newProfile,
                token: token
            }
        });
    } catch (err) {
        if (err.messages) {
            return res.status(422).json({
                message: 'Validation error',
                errors: err.messages,
            });
        }
        return res.status(500).json({
            message: 'Server error',
            error: err.message || err,
        });
    }
};
