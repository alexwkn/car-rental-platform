import {ProfileValidator} from "../middleware/validator/profile.js";
import {VehiculeValidator} from "../middleware/validator/vehicule.js";
import {hash} from "../../utils/hash.js";
import {sign} from "../../utils/jwt.js";
import prisma from "../../database/databaseORM.js";
import {TOKEN_COOKIE_NAME, tokenCookieOptions} from "../../utils/authCookie.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAccountSchema:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - is_renter
 *       properties:
 *         name:
 *           type: string
 *           example: "Antoine Nguyen"
 *         email:
 *           type: string
 *           example: "antoine@mail.com"
 *         password:
 *           type: string
 *           example: "StrongPass123"
 *         adress:
 *           type: string
 *           example: "Rue du Centre 12, Namur"
 *         bank_account:
 *           type: string
 *           example: "BE12 3456 7890 1234"
 *         is_renter:
 *           type: boolean
 *           example: true
 *         profile_picture:
 *           type: string
 *           format: url
 *           example: "https://cdn.key2go.com/profile/default.png"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatedAccountData:
 *       type: object
 *       properties:
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAccountResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Account created successfully"
 *         data:
 *           $ref: '#/components/schemas/CreatedAccountData'
 */

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
                status: newProfile.is_renter ? "renter" : "customer", 
        },
        { expiresIn: '1h' }
    );
        res.cookie(TOKEN_COOKIE_NAME, token, {
            ...tokenCookieOptions,
            maxAge: 60 * 60 * 1000,
        });

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

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAccountWithVehiculeSchema:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - is_renter
 *         - vehicule
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         adress:
 *           type: string
 *         bank_account:
 *           type: string
 *         is_renter:
 *           type: boolean
 *         profile_picture:
 *           type: string
 *         vehicule:
 *           type: object
 *           required:
 *             - model
 *             - licence_plate
 *           properties:
 *             model:
 *               type: string
 *               example: "Peugeot 208"
 *             licence_plate:
 *               type: string
 *               example: "1-ABC-234"
 *             description:
 *               type: string
 *               example: "Véhicule propre, entretien OK"
 */


export const createAccountWithVehicule = async (req, res) => {
    try {
        const {name, email, password, adress, bank_account, is_renter, profile_picture, vehicule} = req.body;

        const validatedData = await ProfileValidator.validate({
            name,
            email,
            password,
            adress,
            bank_account,
            is_renter,
            profile_picture
        });

        const validatedVehicule = await VehiculeValidator.validate({
            ...vehicule,
            owner_id: 1, // pour validation vine
        });
        const { owner_id, ...vehiculeFields } = validatedVehicule;

        const hashedPassword = await hash(validatedData.password);

        const newProfile = await prisma.profile.create({
            data: {
                ...validatedData,
                password: hashedPassword,
                vehicule: {
                    create: [vehiculeFields],
                },
            },
            include: {
                vehicule: true,
            },
        });

        const token = sign({
                id: newProfile.profile_id,
                email: newProfile.email,
                status: newProfile.is_renter ? "renter" : "customer",
        },
        { expiresIn: '1h' }
    );
        res.cookie(TOKEN_COOKIE_NAME, token, {
            ...tokenCookieOptions,
            maxAge: 60 * 60 * 1000,
        });

        res.status(201).json({
            message: 'Account and vehicule created successfully',
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
