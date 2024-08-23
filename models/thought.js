//this is the blog posts
//thoughtText, createdAt (should be able to use default), userName (from user), reactions (comments)

const {Schema, model} = require('mongoose');
//pull in the reactions schema
const Reaction = require('./reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        reaction: {
            type: [Reaction]
        }
        // thoughtText: {
        //     type: String
        // },
        // userName: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'user' //make sure it is user
        //     }
        // ],
        // reaction: [Reaction]
    },
    {
        toJSON: { //bring in virtuals
          virtuals: true
        },
        id: false,
      }
);

//TODO make sure the auto time stamp works how I think it does

// thoughtSchema[0].required = true; //thoughtText (index 0) is required

thoughtSchema.virtual("reactionCount").get(function () {
    return this.reaction.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;