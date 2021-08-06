const {Router} = require('express')
const {
} = require('../controllers/internEventsController')

const router = Router()

router.get('/getInternships')

router.post('/createInternship')
router.post('/createEvent')

router.put('/updateInternship')
router.put('/updateEvent')

module.exports = router