import express from 'express'
import {queries, commands} from '../database'

const router = new express.Router()

router.post('/card/:cardId/board/:boardId', (request, response, next) => {
  const { cardId, boardId } = request.params
  const { userId } = request.session
  const { comment } = request.body

  commands.addComment(boardId, userId, cardId, comment)
  .then((result) => {
    response.json(result)
  })
  .catch(next)
})

router.post('/:commentId/activity/:activityId/delete', (request, response, next) => {
  const { commentId, activityId } = request.params

  commands.deleteComment(parseInt(commentId), activityId)
  .then((result) => {
    response.json(result)
  })
  .catch(next)
})

router.post('/:commentId/activity/:activityId/edit', (request, response, next) => {
  const { commentId, activityId } = request.params
  const { comment } = request.body

  commands.editComment(parseInt(commentId), comment, activityId)
  .then((result) => {
    response.json(result)
  })
  .catch(next)
})

export default router
