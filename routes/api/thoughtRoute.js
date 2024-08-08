const router = require('express').Router();
const Thought = require('../../models/thought');
const reaction = require('../../models/reaction');
//needs a get all, a get 1
//a put, post delete

//post and delete reactions
router.get('/', async (req, res) => {
    try{
        const posts = await Thought.find(); //no parameters, find all
        res.json(posts);
    }
    catch(err){
        res.status(500).json(err);
    }
});

router.get('/:id', async (req,res) => {
    try{
        const posts = await Thought.findOne({ _id: req.params.id });
        //it can miss
        if (!posts){
            res.status(404).json("No post was found with that ID.")
        }
        res.json(posts);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//post thought
router.post('/', async (req,res) => {
    try{
        const newThought = await Thought.create(req.body); //pull data out of the req body
        res.json(newThought);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//post reaction
//adds the reaction made from the req.body to the reaction array of the thought
router.post('/reaction', async (req,res) => {
    try{
        //check if the target thought exists
        //make the reaction
        //reactions aren't initialized, just fed in as a schema to the thoughts (as instructed by the assignment)
        //using find1andUpdate
        const post = await Thought.findOneAndUpdate({ _id: req.body.thoughtId }, {"$push" : {reaction: req.body}}, {new : true});
        res.json(post);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//deletes
//delete reaction first because the thought will use req.params
router.delete('/reaction', async (req, res) => {
    try{
        //will be given the thought and the reaction id, because the alt. is searching every thought
        const post = await Thought.findOne({ _id: req.body.thoughtId });
        if(!post){
            res.status(404).json('No thought with the thought id found');
            return;
        };
        const reaction = Thought.updateOne({_id: req.body.thoughtId}, {"$pullAll": {
            reaction: [{_id: req.body.reactionId}]
        }})
        res.json(reaction);
    }
    catch(err){
        res.status(404).json("Something wasn't found");
    }
})

//delete thought
router.delete('/:id', async (req,res) => {
    try{
        const post = await Thought.findOneAndRemove({ _id: req.params.id });
        if(!post){
            res.status(404).json("Thought not found");
            return;
        }
        res.json("Thought deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;