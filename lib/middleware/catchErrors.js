import { EntityNotFoundError } from 'typeorm';
export const catchErrors = (e, res) => {
    if (e instanceof EntityNotFoundError) {
        res.sendStatus(404);
    }
    else {
        console.error(e);
        res.sendStatus(500);
    }
};
