import { Router } from "express";

const router = Router();

router.post("/logout", (req, res) => {
    res.clearCookie("token");
  
    return res.json({ message: "Logged out successfully" });
});