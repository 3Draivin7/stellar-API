const ApiError = require('../exceptions/api-error')
const Worker = require('../models/worker-model')
const mongoose = require('mongoose');
const schedule = require('node-schedule');


// Планировщик для очистки истории один раз в месяц, в первый день месяца в 00:00
const job = schedule.scheduleJob('0 0 1 * *', async () => {
    try {
     // Обновление всех документов Worker, очищая поле history
     await Worker.updateMany({}, { history: [] });
     console.log('История работников очищена!');
    } catch (err) {
     console.error('Ошибка очистки истории:', err);
    }
   });
   


class WorkerController{
  async  addWorker(req, res, next){
    try {
        const newWorker = new Worker(req.body);
        const savedWorker = await newWorker.save();
        res.status(201).json(savedWorker); 
       } catch (err) {
        console.error(err);
        if (err.code === 11000) {
         res.status(400).json({ message: 'Номер работника уже существует' });
        } else {
         res.status(500).json({ message: 'Не удалось создать работника' });
        }
       }
    }

    async addPoints(req, res) { 
        const { number, points, who } = req.body;  
        
        try { 
            // Ищем работника по номеру вместо ID
            const worker = await Worker.findOne({ number: number }); 
    
            if (!worker) { 
                return res.status(404).json({ message: 'Работник не найден' }); 
            } 
    
            // Проверка, чтобы points были числом
            if (typeof points !== 'number' || points <= 0) {
                return res.status(400).json({ message: 'Количество баллов должно быть положительным числом' });
            }
    
            worker.points += points; 
            worker.history.push({ who, points }); // Объединяем в один объект
            await worker.save(); 
            
            return res.status(200).json({ message: 'Баллы успешно добавлены' }); 
        } catch (error) { 
            console.error('Ошибка при добавлении баллов:', error); 
            return res.status(500).json({ message: 'Ошибка сервера' }); 
        } 
    }

    async deletePoints( req, res ){
        const { points, number } = req.body;
        try { 
            // Ищем работника по номеру вместо ID
            const worker = await Worker.findOne({ number: number }); 
    
            if (!worker) { 
                return res.status(404).json({ message: 'Работник не найден' }); 
            } 
    
            // Проверка, чтобы points были числом
            if (typeof points !== 'number' || points <= 0) {
                return res.status(400).json({ message: 'Количество баллов должно быть положительным числом' });
            }
    
            worker.points -= points; 
            await worker.save(); 
            
            return res.status(200).json({ message: 'Убавили баллы' }); 
        } catch (error) { 
            console.error('Ошибка при добавлении баллов:', error); 
            return res.status(500).json({ message: 'Ошибка сервера' }); 
        } 
    }
    async deleteWorker(req, res) {
        const { number } = req.body; 
       
        try {
         const result = await Worker.deleteOne({ number: number }); 
       
         if (result.deletedCount === 1) {
          return res.status(200).json({ message: 'Работник успешно удален' });
         } else {
          return res.status(404).json({ message: 'Работник не найден' });
         }
        } catch (error) {
         console.error('Ошибка при удалении работника:', error);
         return res.status(500).json({ message: 'Ошибка сервера' });
        }
       }
       async getAllWorker (req, res) {
        try {
         const workers = await Worker.find(); // Использование метода find для получения всех записей из коллекции Worker
         res.json(workers);
        } catch (error) {
         res.status(500).json({ error: 'Ошибка получения работников' });
        }
       }
    
}

module.exports = new WorkerController();