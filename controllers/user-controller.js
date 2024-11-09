const userService = require('../service/user-service'); 
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error')


class UserController { 
    async registration(req, res, next){ 
        try{ 
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, name, secondName} = req.body; 
            const userData  = await userService.registration(email, password, name, secondName); 
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true}); 
            return res.json(userData); 
        } catch(e){ 
           next(e);
        } 
    } 

    async login(req, res, next){ 
        try{ 
            const {email, password} = req.body;
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true}); 
            return res.json(userData); 
        } catch(e){ 
            next(e); 
        } 
    } 

    async logout(req, res, next){ 
        try{ 
            const {refreshToken} = req.body;
            const token = await userService.logout(refreshToken);
            //res.clearCookie('refreshToken');
            return res.json(token);
        } catch(e){ 
            next(e);
        } 
    } 

        async activate(req, res, next) { 
            try {
              const activationLink = req.params.link; 
              // Добавьте проверку activationLink
              if (!activationLink) {
                throw new Error('Ссылка активации не найдена');
              }
              await userService.activate(activationLink); 
              return res.redirect('https://example.com'); 
            } catch (e) { 
                next(e);
            } 
          } 



          async refresh(req, res, next) {
            try {
             const { refreshToken } = req.body;
             const userData = await userService.refresh(refreshToken);
             return res.json(userData);
            } catch (e) {
             next(e);
            }
           }
        

           async getUsers(req, res, next){ 
            try{ 
                const users = await userService.getAllUsers();
                return res.json(users);
            } catch(e){ 
                next(e);
            } 
        } 
        async deleteUser(req, res, next){
            const email = req.params.email;
            try {
                const deletedUser = await userService.deleteUser(email);
              
                if (deletedUser) {
                 res.json({ message: 'Пользователь успешно удален' });
                } else {
                 res.status(404).json({ message: 'Пользователь не найден' });
                }
               } catch (error) {
                res.status(500).json({ message: 'Произошла ошибка при удалении пользователя' });
               }
        }
    } 
           

module.exports = new UserController();
