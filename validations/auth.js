const express = require('express')
const { body } = require('express-validator');
const registerValidator = [
   body("email").isEmail(),
   body("password").isLength({ min: 5 }),
   body("fullName").isLength({ min: 3 }),
   body("avatarUrl").optional().isURL(),
]

const LoginValidator = [
   body("email").isEmail(),
   body("password").isLength({ min: 5 }),
]
const postCreateValidator = [
   body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
   body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
   body('tags', 'Неверный формат тэгов').optional().isString(),
   body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]
module.exports = registerValidator
module.exports = LoginValidator
module.exports = postCreateValidator