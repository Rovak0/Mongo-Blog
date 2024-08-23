const router = require('express').Router();
const Thought = require('../../models/thought');
const User = require('../../models/user');
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
        const posts = await Thought.findById(req.params.id);
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
        const user = await User.findById(req.body.owner);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const newThought = await Thought.create(req.body); //pull data out of the req body
        //need to add the thought to the user
        await User.findByIdAndUpdate(
            req.body.owner,
            {
                $push: {thought: newThought}
            }
        );
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
        // const newReaction = await 
        const post = await Thought.findByIdAndUpdate(
            req.body.thoughtId,
            {"$push" : {reaction: {owner: req.body.owner, reactionText: req.body.reactionText}}}, 
            {new : true});
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
        // const post = await Thought.findById(req.body.thoughtId);
        const post = await Thought.findByIdAndUpdate(
            req.body.thoughtId, 
            {$pull: { reaction:{ reactionId : req.body.reactionTargetId}}},
            { runValidators: true, new: true}
        );
        if(!post){
            res.status(404).json('No thought with the thought id found');
            return;
        };
        
        res.json(post);
    }
    catch(err){
        res.status(404).json("Something wasn't found");
    }
})

//delete thought
router.delete('/:id', async (req,res) => {
    try{
        const post = await Thought.findByIdAndDelete(req.params.id);
        if(!post){
            res.status(404).json("Thought not found");
            return;
        };
        //remove it from the user
        //the thought has a owner property
        console.log(post.owner);
        await User.findByIdAndUpdate(
            post.owner, 
            {
                $pull: {thought: _id = req.params.id}    
            },
            {new: true}
        );
        res.json("Thought deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;