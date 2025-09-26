const { Router } = require('express')
const router = Router()
const { z, file } = require('zod')
const jwt = require('jsonwebtoken')
const path = require("path");
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')


const adminZod = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8)
})

const filePath = path.join(__dirname, "./users.json");
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const response = adminZod.safeParse({ name, email, password });
        if (!response.success) {
            return res.status(422).json({
                msg: "Please enter data in valid format",
            })
        }
        const token = jwt.sign({ email }, process.env.JWT_STRING)

        let users = [];
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            users = JSON.parse(data);
        }

        const existingUser = users.find((r)=> r.email === email || r.password === password);
        if(existingUser) {
            return res.status(409).json({
                msg: "User already exist"
            })
        }
        // Step 2: Add new user
        const id = users.length ? users[users.length - 1].id + 1 : 1; // auto-increment id
        users.push({ id, name, email, password });

        // Step 3: Save back to file
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");

        res.json({
            msg: "User created successfully",
            token
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ msg: "Internal server error" });

    }
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!fs.existsSync(filePath)) {
            return res.status(401).json({
                msg: "No users found."
            })
        }

        const data = fs.readFileSync(filePath, "utf8");
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({
                msg: "Invalid email or password"
            });
        }
        const token = jwt.sign({ email }, process.env.JWT_STRING)
        res.json({
            msg: "User logged in succesfully",
            token
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ msg: "Internal server error" });
    }
})

module.exports = router