import { Router } from "express";
import { pool } from "../db/client";
import { comparePassword } from "../utils/bcrypt";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user.id },
            env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
        });

        return res.json({ message: "Login successful" });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

export default router