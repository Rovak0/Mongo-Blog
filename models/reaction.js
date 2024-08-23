//this is a support piece for thoughts, but should be given to index
const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        // b/c it isn't being initialized, it has to be manually given an id
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
          },
          responseBody: {
            type: String,
            required: true,
            maxlength: 280,
          },
          owner : {
            type: Schema.Types.ObjectId,
            ref: 'user'
          },
          host: {
            type: Schema.Types.ObjectId,
            ref: 'thought'
          }
    }
)

module.exports = reactionSchema;