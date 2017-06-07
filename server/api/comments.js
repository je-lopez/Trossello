import express from 'express'
import {queries, commands} from '../database'

const router = new express.Router()

router.post('/card/:cardId/board/:boardId', (request, response, next) => {
  const { cardId, boardId } = request.params
  const { userId } = request.session
  const { comment } = request.body

  commands.addComment(boardId, userId, cardId, comment)
  .then((result) => {
    response.json(null)
  })
  .catch(next)
})

router.post('/:commentId/activity/:activityId/delete', (request, response, next) => {
  const { commentId, activityId } = request.params

  commands.deleteComment(commentId, activityId)
  .then((result) => {
    response.json(null)
  })
  .catch(next)
})

router.post('/:commentId/edit', (request, response, next) => {
  const { commentId } = request.params
  const { comment } = request.body

  commands.editComment(commentId, comment)
  .then((result) => {
    response.json(null)
  })
  .catch(next)
})

export default router
