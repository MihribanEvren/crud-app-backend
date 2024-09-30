import { mockUsers } from '../utils/constants.mjs';
import { validationResult, matchedData } from 'express-validator';
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword } from '../utils/helpers.mjs';

//@desc     Get all users
//@route    GET /api/users
export const getUsers = (req, res) => {
  console.log(req.session.id);
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  const result = validationResult(req);
  const {
    query: { filter, value },
  } = req;

  if (!filter && !value) return res.send(mockUsers);
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));

  return res.send(mockUsers);
};

//@desc     Get single user
//@route    GET /api/users/:id
export const getUser = (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) {
    res.sendStatus(404);
  }
  res.send(findUser);
};

//@desc    Create new user
//@route   POST /api/users/
export const createUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send(result.array());

  const data = matchedData(req);

  console.log(data);
  data.password = hashPassword(data.password);
  console.log(data);
  const newUser = new User(data);
  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

//@desc    Update the user
//@route   PUT /api/users/:id
export const updateUser = (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.status(200).send(mockUsers[findUserIndex]);
};

//@desc    Update the user field
//@route   PATCH /api/users/:id
export const updateUserField = (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = {
    ...mockUsers[findUserIndex],
    ...body,
  };
  return res.status(200).send(mockUsers[findUserIndex]);
};

//@desc    Delete the user
//@route   DELETE /api/users/:id
export const deleteUser = (req, res) => {
  const { findUserIndex } = req;

  const deletedUser = mockUsers.splice(findUserIndex, 1);

  return res.status(200).send(deletedUser);
};
