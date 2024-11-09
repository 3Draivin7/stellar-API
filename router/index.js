const Router = require('express').Router;
const UserController = require('../controllers/user-controller')
const router = new Router();
const {body} = require('express-validator')
const workerController = require('../controllers/worker-controller');
const GiftController = require('../controllers/gift-controller');
const giftController = require('../controllers/gift-controller');


router.post('/registration',
    body('email').isLength({min: 3, max: 32}),
    body('password').isLength({min: 3, max: 32}),
     UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.post('/refresh', UserController.refresh);
router.get('/users', UserController.getUsers);  
router.delete('/users/:email', UserController.deleteUser);
router.post('/worker', workerController.addWorker);
router.post('/worker/addpoints', workerController.addPoints)
router.post('/worker/deletepoints', workerController.deletePoints);
router.delete('/worker/delete', workerController.deleteWorker);
router.get('/worker/get',workerController.getAllWorker)
router.post('/gift/add',GiftController.addGift)
router.delete('/gift/delete', GiftController.deleteGift)
router.get('/gift', giftController.getAllGifts)
module.exports = router