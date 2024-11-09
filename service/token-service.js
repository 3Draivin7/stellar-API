const jwt = require('jsonwebtoken');
//import jwt from 'jsonwebtoken'; 
const tokenModel = require('../models/toke-model');
const ApiError = require('../exceptions/api-error'); // Предполагается, что у вас есть класс ApiError
const mongoose = require('mongoose');

class TokenService { 
    generateTokens(payload) { 
     const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' }); 
     const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' }); 
    
     return { 
      accessToken, 
      refreshToken 
     }; 
    } 
    
    validateAccessToken(token) { 
     try { 
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET); 
      return userData; 
     } catch (e) { 
      return null; 
     } 
    } 
    
    validateRefreshToken(token) { 
     try { 
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET); 
      return userData; 
     } catch (e) { 
      return null; 
     } 
    } 
    
    async saveToken(userId, refreshToken) { 
     const tokenData = await tokenModel.findOne({ user: userId }); 
    
     // Проверяем токен на валидность перед сохранением 
     const isValid = this.validateRefreshToken(refreshToken);  
     if (!isValid) { 
      throw new ApiError.UnathorizedError('Refresh token is invalid'); 
     }  
    
     if (tokenData) { 
      tokenData.refreshToken = refreshToken; 
      return tokenData.save(); 
     } 
    
     const token = await tokenModel.create({user:userId,refreshToken})
     return token; 
    } 
    
    async removeToken(refreshToken) { 
     const tokenData = await tokenModel.deleteOne({ refreshToken }); 
     return tokenData; 
    } 
    
    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken });
        return tokenData; // Возвращаем найденный токен
       }
   } 


module.exports = new TokenService();
