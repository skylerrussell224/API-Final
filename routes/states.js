const express = require('express')
const router = express.Router()

const statesController = require('../controllers/statesController')
const verifyStates = require('../middleware/verifyStates')

router.get('/', statesController.getAllStates)
router.get('/:state', verifyStates, statesController.getState)
router.get('/:state/capital', verifyStates, statesController.getStateCapital)
router.get('/:state/nickname', verifyStates, statesController.getNickname)
router.get('/:state/population', verifyStates, statesController.getPopulation)
router.get('/:state/admission', verifyStates, statesController.getAdmission)
router.get('/:state/funfact', verifyStates, statesController.getFunfact)
router.post('/:state/funfact', statesController.createNewFunfact)
router.delete('/:state/funfact', verifyStates, statesController.deleteFunfact)
router.patch('/:state/funfact', verifyStates, statesController.updateFunfact)

module.exports = router