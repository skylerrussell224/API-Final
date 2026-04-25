const statesData = require('../data/statesData.json')

const verifyStates = function (req, res, next) {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(state => state.code === stateParam)
    if (!state) {
        return res.status(400).json({ message: "Invalid state abbreviation parameter" })
    }
    next()
}

module.exports = verifyStates