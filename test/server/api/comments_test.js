const { expect, request, knex, queries, commands } = require('../../setup')

const{
  withTwoUsersInTheDatabase,
  withBoardsListsAndCardsInTheDatabase,
  withBoardsListsCardsAndCommentsInTheDatabase,
  loginAs,
} = require('../../helpers')

describe('/api/comments', () => {
  withBoardsListsCardsAndCommentsInTheDatabase(() => {
    context('when not logged in', () => {

      // ADD COMMENT
      describe('POST /api/comments/card/:cardId/board/:boardId', () => {
        it('should render 400 Not Authorized', () => {
          return request('post', '/api/comments/card/1/board/1')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // DELETE COMMENT
      describe('POST /api/comments/:commentId/activity/:activityId/delete', () => {
        it('shuld render 400 Not Authorized', () => {
          return request('post', '/api/comments/1/activity/1/delete')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })

      // EDIT COMMENT
      describe('POST /api/comments/:commentId/activity/:activityId/edit', () => {
        it('shuld render 400 Not Authorized', () => {
          return request('post', '/api/comments/1/activity/1/edit')
            .then(response => {
              expect(response).to.have.status(400)
            })
        })
      })
    })

    context('when logged in', () => {
      beforeEach(() => {
        return loginAs(1455)
      })

      // ADD COMMENT
      describe('POST /api/comments/card/:cardId/board/:boardId', () => {
        it('should add a new comment', () => {
          const attributes = {
            comment: 'AddCommentTest'
          }
          return request('post', '/api/comments/card/80/board/101', attributes)
            .then((response) => {
              expect(response).to.have.status(200)
            })
        })
      })

      // DELETE COMMENT
      describe('POST /api/comments/:commentId/activity/:activityId/delete', () => {
        it('should delete a comment', () => {
          return request('post', '/api/comments/1/activity/1/delete')
            .then((response) => {
              expect(response).to.have.status(200)
            })
        })
      })

      // EDIT COMMENT
      describe('POST /api/comments/:commentId/activity/:activityId/edit', () => {
        it('should edit a comment', () => {
          const attributes = {
            comment: 'EditedCommentTest'
          }
          return request('post', '/api/comments/1/activity/1/edit', attributes)
            .then((response) => {
              expect(response).to.have.status(200)
            })
        })
      })
    })
  })
})