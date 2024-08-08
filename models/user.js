//requires : username, email, thoughts, friends
    //virtual schema for friendCount

const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            String,
            required: true,
        },
        email : {
            String,
            required: true,
         },
        thought: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought' //make sure it is thought
            }
        ],
        friend: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user' //make sure it is user
            }
        ]
    },
    {
        toJSON: { //bring in virtuals
          virtuals: true
        },
        id: false,
      }
);

//TODO: email verification

// const required = ['username', 'email'];
// for (attribute in required){ //this runs off indexes
//     userSchema[attribute].reuired = true;
// };

userSchema.virtual("friendCount").get(function () {
    return this.friend.length;
});

//turn on the model
const User = model('user', userSchema);

module.exports = User;