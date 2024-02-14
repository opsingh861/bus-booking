import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import * as authService from '../services/authService.js';

export const signupAdmin = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        if (role !== 'admin') {
            return res.status(401).json({ message: 'Unathorized', success: false });
        }
        if (!name || !username || !password || !role) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long', success: false });
        }

        const getUser = await User.findOne({ username, role });
        if (getUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'Admin signed up successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const signup = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        if (role === 'admin') {
            return res.status(401).json({ message: 'Unathorized', success: false });
        }
        if (!name || !username || !password || !role) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long', success: false });
        }

        const getUser = await User.findOne({ username, role });
        if (getUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User signed up successfully', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (role === 'admin') {
            return res.status(401).json({ message: 'Unathorized', success: false });
        }
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        const user = await User.findOne({ username, role: 'user' });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }
        const token = authService.generateToken(user);
        res.status(200).json({ token, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (role !== 'admin') {
            return res.status(401).json({ message: 'Unathorized', success: false });
        }

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        const user = await User.findOne({ username, role: 'admin' });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }
        const token = authService.generateToken(user);
        res.status(200).json({ token, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', success: false });
    }
};

