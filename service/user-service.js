const UserModel = require('../models/user-model') 
const bcrypt = require(`bcrypt`) 
const uuid = require('uuid') 
const mailService = require('./mail-service') 
const tokenService = require('./token-service') 
const UserDto = require('../dtos/user-dtos') 
const ApiError = require('../exceptions/api-error') 
const mongoose = require('mongoose');
 
class UserService { 
 async registration(email, password, name, secondName) { 
  const candidate = await UserModel.findOne({ email }); 
  if (candidate) { 
  throw ApiError.BadRequest(`Пользователь с почтовым адрессом ${email} уже есть!`); 
  } 
  const hashPassword = await bcrypt.hash(password, 3); 
  const activationLink = uuid.v4(); 
  const user = await UserModel.create({ email, password: hashPassword, activationLink, name, secondName }); 
  await mailService.sendActivationMail(email, name, secondName,`${process.env.API_URL}/api/activate/${activationLink}`); 
 
  const userDto = new UserDto(user); 
  const tokens = tokenService.generateTokens({ ...userDto }); 
  await tokenService.saveToken(userDto.id, tokens.refreshToken); 
 
  return { 
  ...tokens, 
  user: userDto 
  }; 
 } 
 
 async activate(activationLink) { 
  const user = await UserModel.findOne({ activationLink }); 
  if (!user) { 
  throw ApiError.BadRequest('Неккоректная ссылка активации'); 
  } 
  if (!user.isActivated) { // Проверяем, был ли пользователь неактивирован
   user.isActivated = true; 
   await user.save(); 
  } 
 } 
 
 async login(email, password){ 
  const user = await UserModel.findOne({email}) 
  if (!user){ 
  throw ApiError.BadRequest('Пользователь с таким табельным номером не найден') 
  } 
  const isPassEquals = await bcrypt.compare(password, user.password); 
  if(!isPassEquals){ 
  throw ApiError.BadRequest('Не верный пароль'); 
  } 
  const userDto = new UserDto(user); 
  const tokens = tokenService.generateTokens({...userDto}); 
  await tokenService.saveToken(userDto.id, tokens.refreshToken); 
  return { 
  ...tokens, 
  user: userDto 
  }; 
 } 
 
 async logout(refreshToken){ 
  const token = await tokenService.removeToken(refreshToken); 
  return token; 
 } 

 async refresh(refreshToken) {
  if (!refreshToken) {
   throw ApiError.UnathorizedError();
  }
 
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);
 
  if (!userData || !tokenFromDb) {
   throw ApiError.UnathorizedError();
  }
 
  const user = await UserModel.findById(userData.id);
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });
 
  // Сохраняем обновленный refreshToken
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
 
  return {
   ...tokens,
   user: userDto
  };
 }
 
 async getUserInfo(refreshToken) { 
  const userData = tokenService.validateRefreshToken(refreshToken); 
  if (!userData) { 
  throw ApiError.UnathorizedError(); 
  } 
  const user = await UserModel.findById(userData.id); 
  return user; 
 } 
 async getAllUsers(){
  const users = await UserModel.find();
  return users;
}

async deleteUser(email){
    try {
     const user = await UserModel.findOneAndDelete({ email });
     return user; // Возвращаем удаленного пользователя
    } catch (error) {
     throw error; // Передаем ошибку вверх по цепочке вызовов
    }
}

 } 
 
 module.exports = new UserService();