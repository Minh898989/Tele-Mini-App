const checkUser = (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }
    next();
};

module.exports = { checkUser };