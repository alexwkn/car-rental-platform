import prisma from "../../../database/databaseORM.js";

/**
 * @swagger
 * components:
 *   responses:
 *     mustBeOwner:
 *       description: The action must be realized by the owner of the resource
 *       content:
 *         application/json:
 *           example:
 *             message: "You are not the owner of this resource"
 */

// verif que l'utilisateur connecté est bien le propriétaire
export const isOwnVehicule = async (req, res, next) => {
    if (req.session.status === 'manager') {
        return res.status(403).json({ message: "Réservé aux clients propriétaires, pas aux managers" });
    }

    const vehicule = await prisma.vehicule.findUnique({
        where: { vehicule_id: parseInt(req.params.id) },
    });

    if (!vehicule) {
        return res.status(404).json({ message: "Vehicule not found" });
    }

    if (vehicule.owner_id !== req.session.id) {
        return res.status(403).json({ message: "Vous pouvez gérez les véhicules qui vous appartienne uniquement" });
    }

    req.resource = vehicule;
    next();
};

export const isOwnOffer = async (req, res, next) => {
    if (req.session.status === 'manager') {
        return res.status(403).json({ message: "Réservé aux clients propriétaires, pas aux managers" });
    }

    const offer = await prisma.offer.findUnique({
        where: { offer_id: parseInt(req.params.id) },
        include: { vehicule: true },
    });

    if (!offer) {
        return res.status(404).send("Offer not found");
    }

    if (offer.vehicule.owner_id !== req.session.id) {
        return res.status(403).json({ message: "Non autorisé à modifier cette offre" });
    }

    req.resource = offer;
    next();
};
