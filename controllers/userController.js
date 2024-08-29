const {User, Thought, reaction} = require('../models');
const ObjectId = require('mongodb').ObjectId; 

module.exports = {
    async getAllUser(req, res) {
        try{
            const users = await User.find(); //no parameters, find all
            console.log(users);
            res.json(users);
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    async getOneUser(req, res) {
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
    },

    async makeUser(req, res) {
        try{
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    
    async makeFriend(req,res) {
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
    },

    async updateUser(req, res) {
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
    },

    async deleteFriend(req, res) {
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
    }, 

    async deleteUser(req, res) {
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
    }
};