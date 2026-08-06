import {TOKEN_COOKIE_NAME, tokenCookieOptions} from "../../utils/authCookie.js";

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Clear the web session cookie
 *     tags: [Authentication]
 *     responses:
 *       204:
 *         description: Cookie cleared
 */

export const logout = (req, res) => {
    res.clearCookie(TOKEN_COOKIE_NAME, tokenCookieOptions);
    res.sendStatus(204);
};
