import { mockUsers } from '../utils/constants.mjs';

export const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return res.status(400).json({ error: 'Invalid ID format' });

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1)
    return res.status(404).json({ error: 'User not found' });
  req.findUserIndex = findUserIndex;
  next();
};
