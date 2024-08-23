const router = require('express').Router();
const User = require('../../models/user');
const ObjectId = require('mongodb').ObjectId; 
//i could do the route/controllers split, but I don't feel like managing that right now

//need get routes for all/specific
//post, put, delete for create, update, delete

//api/users
router.get('/', async (req, res) => {
    try{
        const users = await User.find(); //no parameters, find all
        console.log(users);
        res.json(users);
    }
    catch(err){
        res.status(500).json(err);
    }
});

router.get('/:id', async (req,res) => {
    try{
        const users = await User.findOne({ _id: req.params.id });
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
        const newUser = await User.create(req.body);
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
        const friend = await User.findById(req.body.friendId);
        if(!friend){
            res.status(404).json('No user with the friend id found');
            return;
        }
        const user = await User.findOneAndUpdate({_id: req.body.userId }, {"$push" : {friend : req.body.friendId}}, {new : true}); //"$push" should append to the friend array
        res.json(user);
    }
    catch(err){
        res.status(500).json(err);
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
                const user = await User.findOneAndUpdate({_id: req.params.id }, {username : req.body.username}, {email : req.body.email}, {new : true});
                res.json(user);
            }
            else{
                //only username
                const user = await User.findOneAndUpdate({_id: req.params.id }, {username : req.body.username}, {new : true});
                res.json(user);
            }
        }
        else if(req.body.email){
            //only email
            const user = await User.findOneAndUpdate({_id: req.params.id }, {email : req.body.email}, {new : true});
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
        console.log("here");
        const user = await User.findById(req.body.userId);
        console.log("friend");
        if(!user){ 
            res.status(404).json('No user with the user id found');
            return;
        };
        // const user = User.updateOne(
        //     {_id: req.body.userId}, 
        //     {"$pullAll": {"friend": }},
        //     {new: true}
        // )
        //go through the user's friend array and remove any with the friend id
        // console.log("Search");
        // const friend = user.friend[0]
        // console.log(friend._id);
        // // user.friend = user.friend.filter(person => (person.getId() !== req.body.friendId));

        // //save the change
        // console.log("Save");
        // await user.save();

        await User.findByIdAndUpdate(
            req.body.userId, 
            {
                $pull: {friend: _id = req.body.friendId}
            },
            {new: true}
        );

        res.json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//delete user
router.delete('/:id', async (req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            res.status(404).json("User not found");
            return;
        }
        res.json("User deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;
