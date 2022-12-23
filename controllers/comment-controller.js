const { Comment, Pizza } = require ('../models');

const commentController = {
    //add comment to Pizza
    addComment({ params, body }, res){
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            console.log(_id)
            return Pizza.findOneAndUpdate(
                {_id: params.pizzaId }, 
                //adds data to the array
                {$push: { comments: _id} }, 
                //receive back the updated data
                {new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this ID'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    addReply({ params, body }, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            { $push: { replies: body}}, 
            {new: true, runValidators: true}
        )
        .then(dbPizzaData => {
            if (!dbPizzaData){
                res.status(404).json({message: 'No pizza found with this ID'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    removeComment( {params }, res){
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment){
                res.status(404).json({ message: 'No comment with this ID'})
            }
        return Pizza.findOneAndUpdate(
            {_id: params.pizzaId}, 
            {$pull: {comments: params.commentId}}, 
            {new: true}
        );    
        })
        .then(dbPizzaData => {
            if (!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this ID '});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }, 

    removeReply( {params}, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$pull: {replies: {replyId:params.replyId }}},
            {new: true}
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    }
};

module.exports = commentController; 