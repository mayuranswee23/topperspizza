const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const replySchema = new Schema({
    replyBody: {
        type: String,
        requierd: true,
        //set custom ID to avoid confusion with parent ID
        default: () => new Types.ObjectId()
    }, 
    writtenBy: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: Date, 
        default: Date.now, 
        get: createdAtVal => dateFormat(createdAtVal)
    }
},
{
    toJSON: {
        getters: true
    }
})

const CommentSchema = new Schema({
    writtenBy: {
        type: String, 
        required: true
    }, 
    commentBody: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: Date, 
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    }, 
    replies: [replySchema]
},
{
    toJSON: {
        getters: true, 
        virtuals: true
    }, 
    id: false
});

CommentSchema.virtual('replyCount').get(function(){
    return this.replies.length;
})

const Comment = model('Comment', CommentSchema); 

module.exports = Comment; 