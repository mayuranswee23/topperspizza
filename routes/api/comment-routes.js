const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller'); 

// /api/comments/<pizzaId>
router
.route('/:pizzaId')
.post(addComment);

// /api/comments.<pizzaId>/<commentId>
router
.route('/:pizzaId/:commentId')
.put(addReply)
.delete(removeComment);

// /api/comments/<pizzaID>/commentID/replyID
router
.route('/api/:pizzaId/:commentId/:replyId')
.delete(removeReply);


module.exports = router; 