const statesData = require('../data/statesData.json')
const stateMongo = require('../models/States')

const getAllStates = async (req, res) => {
    const contig = req.query.contig
    let filteredStates = statesData;

    if (contig === "true") {
        return res.json(statesData.filter(s => s.code !== "AK" && s.code !== "HI"))
    }
    if (contig === "false") {
        return res.json(statesData.filter(s => s.code === "AK" || s.code === "HI"))
    }

    const dbStates = await stateMongo.find().lean();

    const responseStates = filteredStates.map(state => {
        const match = dbStates.find(
            dbState => dbState.stateCode === state.code
        );

        if (match?.funfacts?.length) {
            return {
                ...state,
                funfacts: match.funfacts
            };
        };

        return state;
    });

    res.json(responseStates);

    res.json(statesData)
}
const getState = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(state => state.code === stateParam)
    const responseState = {...state};

    const dbState = await stateMongo.findOne({stateCode: stateParam}).lean();

    if (dbState?.funfacts?.length) {
        responseState.funfacts = dbState.funfacts;
    }
    res.json(responseState)
}
const getStateCapital = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(state => state.code === stateParam)
    res.json({
        state: state.state,
        capital: state.capital_city
    })
}
const getNickname = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(state => state.code === stateParam)
    res.json({
        state: state.state,
        nickname: state.nickname
    })
}
const getPopulation = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(state => state.code === stateParam)
    res.json({
        state: state.state.toUpperCase(),
        population: state.population
    })
}
const getAdmission = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(state => state.code === stateParam)
    res.json({
        state: state.state.toUpperCase(),
        admitted: state.admission_number
    })
}

const getFunfact = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(s => s.code === stateParam)

    const stateFacts = await stateMongo.findOne({ stateCode: stateParam })

    if (!stateFacts) {
        return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` })
    }
    const randomFact =
        stateFacts.funfacts[
        Math.floor(Math.random() * stateFacts.funfacts.length)
        ]

    res.json({
        funfact: randomFact
    })
}

const createNewFunfact = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()

    if (!req?.params?.state || !req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
        if (!Array.isArray(stateFacts.funfacts)) {
        return res.status(400).json({ 'message': `State fun facts value must be an array` }) // no working
    }
    
    const existingState = await stateMongo.findOne({
        stateCode: stateParam
    })

    try {
        if (existingState) {
            existingState.funfacts.push(...req.body.funfacts)
            const result = await existingState.save();
            res.status(201).json(result);
        } else {
            const result = await stateMongo.create({
                stateCode: stateParam,
                funfacts: req.body.funfacts
            });
            res.status(201).json(result);

        }

    } catch (err) {
        console.error(err);
    }
}

const updateFunfact = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(s => s.code === stateParam)
    const existingState = await stateMongo.findOne({ stateCode: stateParam })
    const funfact = req.body.funfact

    if (!req.body.index) {
        return res.status(400).json({'message': "State fun fact index value required"});
    }
    if (typeof req.body.funfact !== 'string'){
            return res.status(400).json({ 'message': "State fun fact value required"});
    }
    if (!existingState) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` })
    }

    const updateIndex = req.body.index - 1
    
    if (updateIndex < 0 || updateIndex >= existingState.funfacts.length) {
        return res.status(404).json({ 'message': `No Fun Fact found at that index for ${state.state}` })
    } else {
        existingState.funfacts[updateIndex] = funfact
        const result = await existingState.save();
        res.status(200).json(result);
    }
}


const deleteFunfact = async (req, res) => {
    const stateParam = req.params.state.toUpperCase()
    const state = statesData.find(s => s.code === stateParam)
    const existingState = await stateMongo.findOne({ stateCode: stateParam })
    
    if (!req.body.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required'}); 
    }
    if (!existingState) {
        return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` })
    }

    const deleteIndex = req.body.index - 1

    if (deleteIndex < 0 || deleteIndex >= existingState.funfacts.length) {
        return res.status(404).json({ 'message': `No Fun Fact found at that index for ${state.state}` })
    } else {
        existingState.funfacts.splice(deleteIndex, 1);
        const result = await existingState.save();
        res.status(200).json(result);
    }
}

module.exports = {
    getAllStates,
    getState,
    getStateCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunfact,
    createNewFunfact,
    deleteFunfact,
    updateFunfact
}