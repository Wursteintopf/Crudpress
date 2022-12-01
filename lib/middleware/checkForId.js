export const checkForId = (req, res, next) => {
    const id = parseInt(req.body.id);
    if (!id) {
        res.status(400).send('No id provided.');
        return;
    }
    next();
};
