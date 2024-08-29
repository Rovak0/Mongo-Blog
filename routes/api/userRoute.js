const router = require('express').Router();
const User = require('../../models/user');
const ObjectId = require('mongodb').ObjectId; 

//need get routes for all/specific
//post, put, delete for create, update, delete

//i could do the route/controllers split, but I don't feel like managing that right now
    //fine, I'll do it because you required it without telling me
const {
    getAllUser, 
    getOneUser,
    makeUser,
    makeFriend,
    updateUser,
    deleteFriend,
    deleteUser
} = require('../../controllers/userController')


router.route('/').get(getAllUser).post(makeUser)


//friend
router.route('/friend').post(makeFriend).delete(deleteFriend);

//with id
router.route('/:id').get(getOneUser).put(updateUser).delete(deleteUser);




//deletes
//removing a friend based on req.body items
// router.delete('/friend', async (req, res) => {
//     try{
//         //test if friend exists, then try to pull from the user friends
//         console.log("here");
//         const user = await User.findById(req.body.userId);
//         console.log("friend");
//         if(!user){ 
//             res.status(404).json('No user with the user id found');
//             return;
//         };
//         // const user = User.updateOne(
//         //     {_id: req.body.userId}, 
//         //     {"$pullAll": {"friend": }},
//         //     {new: true}
//         // )
//         //go through the user's friend array and remove any with the friend id
//         // console.log("Search");
//         // const friend = user.friend[0]
//         // console.log(friend._id);
//         // // user.friend = user.friend.filter(person => (person.getId() !== req.body.friendId));

//         // //save the change
//         // console.log("Save");
//         // await user.save();

//         await User.findByIdAndUpdate(
//             req.body.userId, 
//             {
//                 $pull: {friend: _id = req.body.friendId}
//             },
//             {new: true}
//         );

//         res.json(user);
//     }
//     catch(err){
//         res.status(500).json(err);
//     }
// })


module.exports = router;
