const router = require('express').Router();
const User = require('../../models/user');

//i could do the route/controllers split, but I don't feel like managing that right now

//need get routes for all/specific
//post, put, delete for create, update, delete

//api/users
router.get('/', async (req, res) => {
    try{
        const users = await User.find(); //no parameters, find all
        res.json(users);
    }
    catch(err){
        res.status(500).json(err);
    }
});

router.get('/:id', async (req,res) => {
    try{
        const users = await User.findOne({ _id: req.params.userId });
        //it can miss
        if (!users){
            res.status(404).json("No user was found with that ID.")
        }
        res.json(users);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//post, so create a new user
router.post('/', async (req,res) => {
    try{
        const newUser = await User.create(req.body); //pull data out of the req body
        res.json(newUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


//update friends
//needs the id of the person adding the friend, and the friend's id
//those should just be in the req body
//needs to be above the put id
router.post('/friend', async (req, res) => {
    try{
        //there will be a userId and a friendId
        const friend = await User.findOne({ _id: req.body.friendId });
        if(!friend){
            res.status(404).json('No user with the friend id found');
            return;
        }
        const user = await User.findOneAndUpdate({_id: req.body.userId }, {"$push" : {friend : req.body.friendId}}, {new : true}); //"$push" should append to the friend array
        res.json(user);
    }
    catch(err){
        res.statusCode(500).json(err);
    }
});

//put, update user
//updating the thoughts shouldn't be done here
//changing the thoughts falls better with the thoughts page itself
router.put('/:id', async (req,res) => {
    try{
        //there is a find and update function
        //if I want to update, I need to know what to update
        //this can be done with if blocks
        if(req.body.username){
            if(req.body.email){
                //both username and email
                const user = await User.findOneAndUpdate({_id: req.params.userId }, {username : req.body.username}, {email : req.body.email}, {new : true});
                res.json(user);
            }
            else{
                //only username
                const user = await User.findOneAndUpdate({_id: req.params.userId }, {username : req.body.username}, {new : true});
                res.json(user);
            }
        }
        else if(req.body.email){
            //only email
            const user = await User.findOneAndUpdate({_id: req.params.userId }, {email : req.body.email}, {new : true});
            res.json(user);
        }
        res.status(404).json("Either the user wasn't found, or the updates weren't found.");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//deletes
//removing a friend based on req.body items
router.delete('/friend', async (req, res) => {
    try{
        //test if friend exists, then try to pull from the user friends
        const friend = await User.findOne({ _id: req.body.friendId });
        if(!friend){ //no friend :(
            res.status(404).json('No user with the friend id found');
            return;
        };
        const user = User.updateOne({_id: req.body.userId}, {"$pullAll": {
            friend: [{_id: req.body.friendId}]
        }})
    }
    catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;
