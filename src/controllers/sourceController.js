const Source = require('../models/Source');
const jwt =    require('jsonwebtoken');

module.exports = {

    async getDistinctSources(req,res){

                try {
                    const sources = await Source.distinct("sourceName");
                    if(sources){
                        console.log("sources:", sources);
                        console.log("response::");
                        // console.log(json({authData, sources}));
                        return res.json({user: req.user || null, sources})
                    }    
                } catch (error) {
                    console.log(error);
                    return res.status(400).json({ message: 'we dont have any sources yet'});
                }
            
    },
    async getOneSource(req,res){
        
                console.log("req.params:",req.params);
                const { sourceName  } = req.params;
                const query = sourceName  ? { sourceName } : {} ;
                try {
                    const sources = await Source.find(query);
                    if(sources){
                        console.log("sources:", sources);
                        return res.json({user: req.user || null, sources})
                    }    
                } catch (error) {
                    console.log(error);
                    return res.status(400).json({ message: 'we dont have any sources yet'});
                }

    },




}