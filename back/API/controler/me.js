/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get the identity of the currently authenticated user (client or manager)
 *     description: |
 *       Renvoie directement le contenu du JWT vérifié (posé par checkJWT dans
 *       req.session). Utilisé par le front web pour savoir "qui est connecté"
 *       sans jamais avoir besoin de lire le token lui-même (il est dans un
 *       cookie httpOnly, donc illisible en JavaScript).
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Identité extraite du JWT (id, name, email, status)
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 */
export const me = (req, res) => {
    res.status(200).json(req.session);
};
