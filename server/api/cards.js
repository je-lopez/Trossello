import express from 'express'
import {queries, commands} from '../database'

const router = new express.Router()


// UPDATE
router.post('/:cardId', (request, response, next) => {
  commands.updateCard(request.params.cardId, request.body)
    .then(card => {
      if (card){
        response.json(card)
      }else{
        response.status(404).json(null)
      }
    })
    .catch(next)
})

// ARCHIVE
router.post('/:cardId/archive', (request, response, next) => {
  commands.archiveCard(request.session.userId, request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// UNARCHIVE
router.post('/:cardId/unarchive', (request, response, next) => {
  commands.unarchiveCard(request.session.userId, request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// DELETE
router.post('/:cardId/delete', (request, response, next) => {
  const { cardId } = request.params
  queries.getCardById(cardId).then( card =>
    commands.deleteCard(
      request.session.userId,
      card.board_id,
      cardId
    )
  )
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// MOVE
router.post('/:cardId/move', (request, response, next) => {
  let { boardId, listId, order } = request.body
  let { cardId } = request.params
  let { userId } = request.session
  boardId = Number(boardId)
  cardId  = Number(cardId)
  listId  = Number(listId)
  order   = Number(order)
  commands.moveCard(userId, { boardId, cardId, listId, order })
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

//ADD/REMOVE LABEL
router.post('/:cardId/labels/:labelId', (request, response, next) => {
  let {cardId, labelId} = request.params

  commands.addOrRemoveCardLabel(cardId, labelId)
  .then(() => {
    response.json(null)
  })
  .catch(next)

})

router.post('/:cardId/board/:boardId/comment', (request, response, next) => {
  const { cardId, boardId } = request.params
  const { userId } = request.session
  const { comment } = request.body

  commands.addComment(boardId, userId, cardId, comment)
  .then((result) => {
    response.json(null)
  })
  .catch(next)
})

router.post('/:cardId/comment/delete', (request, response, next) => {
  console.log('comment route')
  const { commentId, activityId } = request.body

  commands.deleteComment(commentId, activityId)
  .then((result) => {
    response.json(null)
  })
  .catch(next)
})

export default router
