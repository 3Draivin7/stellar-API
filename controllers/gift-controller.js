const Gift = require('../models/gift-model')
const mongoose = require('mongoose');

class GiftController{
async  addGift(req, res, next){
    try {
        const newGift = new Gift(req.body); 
        const savedGift = await newGift.save();
        res.status(201).json(savedGift); 
       } catch (err) {
        res.status(500).json({ message: 'Не удалось создать подарок' });
       }
    }
    async deleteGift(req, res) {
        const { id } = req.body; 
       
        try {
         const result = await Gift.deleteOne({ _id: id }); 
       
         if (result.deletedCount === 1) {
          return res.status(200).json({ message: 'подарок удален' });
         } else {
          return res.status(404).json({ message: 'подарок не найден' });
         }
        } catch (error) {
         console.error('Ошибка при удалении подарка:', error);
         return res.status(500).json({ message: 'Ошибка сервера' });
        }
       }
       async getAllGifts (req, res) {
        try {
         const gifts = await Gift.find(); // Использование метода find для получения всех записей из коллекции Worker
         res.json(gifts);
        } catch (error) {
         res.status(500).json({ error: 'Ошибка получения подарков' });
        }
       }
}
module.exports = new GiftController();