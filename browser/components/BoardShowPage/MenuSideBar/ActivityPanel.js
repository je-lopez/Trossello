import React, { Component } from 'react'
import Link from '../../Link'
import moment from 'moment'
import './ActivityPanel.sass'
import $ from 'jquery'

class ActivityPanel extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      refs: ''
    }
  }

  render() {
    const activities = this.props.board.activity.map(activity => {
      if ((this.props.card && this.props.card.id === activity.card_id) || !this.props.card) {
        return <Activity key={activity.id} activity={activity} users={this.props.board.users} board={this.props.board}/>
      }
    })
    const className =
      `BoardShowPage-MenuSideBar-ActivityPanel ${this.props.className||''}`
    return <div className={className}>
      {activities}
    </div>
  }
}

const MainPaneActivity = props => {
  const { board, openPanel } = props
  const recentActivity = board.activity.slice(0, 15).map( activity =>
    <Activity key={activity.id} activity={activity}
      users={board.users} board={board} />
  )
  return <div className='BoardShowPage-MenuSideBar-ActivityPanel'>
    {recentActivity}
    <Link onClick={openPanel}
      className='BoardShowPage-MenuSideBar-ActivityPanel-viewLink'
    >
      View all activity...
    </Link>
  </div>
}

const activityString = (activity, user, board) => {
  const openCardModal = `/boards/${activity.board_id}/cards/${activity.card_id}`

  const checkIfCardExists = (card) => typeof(card)==='object'

  let card, list, cardName
  const metadata = JSON.parse(activity.metadata)
  const stringClass =
    "BoardShowPage-MenuSideBar-ActivityPanel-Activity-string"
  const cardNameLink =
    'BoardShowPage-MenuSideBar-ActivityPanel-Activity-string-cardNameLink'
  const timeClass =
    'BoardShowPage-MenuSideBar-ActivityPanel-Activity-time'
  const commentClass =
    'BoardShowPage-MenuSideBar-ActivityPanel-Activity-comment'

  switch (activity.type) {
    case 'JoinedBoard':
      return <span className={stringClass}>
        joined this board
        <span className={timeClass}>
          {moment(activity.created_at).fromNow()}
        </span>
      </span>
    case 'InvitedToBoard':
      return <span className={stringClass}>
        invited {metadata.invited_email} to this board
        <span className={timeClass}>
          {moment(activity.created_at).fromNow()}
        </span>
      </span>
    case 'UpdatedBoard':
      if (metadata.attribute_updated === 'name') {
        return <span className={stringClass}>
          changed board name to {metadata.new_board_name} from {metadata.prev_board_name}
          <span className={timeClass}>
            {moment(activity.created_at).fromNow()}
          </span>
        </span>
      } else if (metadata.attribute_updated === 'background_color') {
        return <span className={stringClass}>
          changed background color
          <span className={timeClass}>
            {moment(activity.created_at).fromNow()}
          </span>
        </span>
      }
    case 'AddedCard':
      return <span className={stringClass}>added card
        <Link href={openCardModal}
          className={cardNameLink}
        >
          {metadata.content.slice(0, 25)}
        </Link>
        <Link href={openCardModal}
          className={timeClass}
        >
          {moment(activity.created_at).fromNow()}
        </Link>
      </span>
    case 'MovedCard':
      const prev_list = board.lists.find(list => list.id === metadata.prev_list_id)
      const new_list = board.lists.find(list => list.id === metadata.new_list_id)
      return <span className={stringClass}>moved card
        <Link href={openCardModal}
          className={cardNameLink}
        >
          {metadata.content.slice(0, 25)}
        </Link>
        from list {prev_list.name} to list {new_list.name}
        <Link href={openCardModal}
          className={timeClass}
        >
          {moment(activity.created_at).fromNow()}
        </Link>
      </span>
    case 'ArchivedCard':
      return <span className={stringClass}>archived card
        <Link href={openCardModal}
          className={cardNameLink}
        >
          {metadata.content.slice(0, 25)}
        </Link>
        <Link href={openCardModal}
          className={timeClass}
        >
          {moment(activity.created_at).fromNow()}
        </Link>
      </span>
    case 'UnarchivedCard':
      return <span className={stringClass}>unarchived card
        <Link href={openCardModal}
          className={cardNameLink}
        >
          {metadata.content.slice(0, 25)}
        </Link>
        <Link href={openCardModal}
          className={timeClass}
        >
          {moment(activity.created_at).fromNow()}
        </Link>
      </span>
    case 'AddedList':
      return <span className={stringClass}>
        added list {metadata.list_name}
        <span className={timeClass}>
          {moment(activity.created_at).fromNow()}
        </span>
      </span>
    case 'CreatedBoard':
      return <span className={stringClass}>
        created board {board.name}
        <span className={timeClass}>
          {moment(activity.created_at).fromNow()}
        </span>
      </span>
    case 'ArchivedList':
      return <span className={stringClass}>
        archived list {metadata.list_name}
        <span className={timeClass}>
          {moment(activity.created_at).fromNow()}
        </span>
      </span>
    case 'UnarchivedList':
      return <span className={stringClass}>
        unarchived list {metadata.list_name}
        <span className={timeClass}>
          {moment(activity.created_at).fromNow()}
        </span>
      </span>
    case 'DeletedCard':
      return <span className={stringClass}>
        deleted card #{activity.card_id}
        <span className={timeClass}>
          {moment(activity.created_at).fromNow()}
        </span>
      </span>
    case 'AddedComment':
      const comment = board.comments.find((comment) => {
        return comment.id === metadata.comment_id
      })
      return (
        <Comment comment={comment} activity={activity} />
      )
    default:
      return null
  }
}

class Comment extends Component {
  constructor(props) {
    super(props)
    console.log('inside comment class')
    this.state = {
      value: this.props.comment.comment,
      editing: false
    }
  }

  deleteComment(event) {
    event.preventDefault()
    $.ajax({
      method: "post",
      url: `/api/comments/${this.props.comment.id}/activity/${this.props.activity.id}/delete`,
      contentType: "application/json; charset=utf-8"
    }).then(() => {
      boardStore.reload()
    })
  }

  editComment(event) {
    event.preventDefault()
    if (!this.state.editing) {
      this.setState({
        editing: true
      })
    } else {
      $.ajax({
        method: "post",
        url: `/api/comments/${this.props.comment.id}/activity/${this.props.activity.id}/edit`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({comment: this.refs.comment.textContent})
      })
      .then(() => {
        boardStore.reload()
        this.setState({
          editing: false
        })
      })
    }
  }

  render() {
    const stringClass =
      "BoardShowPage-MenuSideBar-ActivityPanel-Activity-string"
    const timeClass =
      'BoardShowPage-MenuSideBar-ActivityPanel-Activity-time'
    const commentClass =
      'BoardShowPage-MenuSideBar-ActivityPanel-Activity-comment'
    const metadata = JSON.parse(this.props.activity.metadata)

    const date = metadata.lastEdited
                 ? 'Edited ' + moment(metadata.lastEdited).fromNow()
                 : moment(this.props.activity.created_at).fromNow()

    return (
      <span className={stringClass}>
        <span ref="comment" className={commentClass} contentEditable={this.state.editing}>{ this.state.value }</span>
        <div className={timeClass}>
          {date}
          &nbsp;-&nbsp;
          <Link onClick={this.editComment.bind(this)}>
            { (this.state.editing) ? 'Save' : 'Edit' }
          </Link>
          &nbsp;-&nbsp;
          <Link onClick={this.deleteComment.bind(this)}>
            Delete
          </Link>
        </div>
      </span>
    )
  }
}

const Activity = props => {
  const { activity, users, board } = props
  const user = users.find(user => user.id === activity.user_id)

  return <div className='BoardShowPage-MenuSideBar-ActivityPanel-Activity'>
    <img
      className='BoardShowPage-MenuSideBar-ActivityPanel-Activity-gravatar'
      src={user.avatar_url}
    />
    <span className='BoardShowPage-MenuSideBar-ActivityPanel-Activity-username'>
      {user.name}
    </span>
    {activityString(activity, user, board)}
    <div className='BoardShowPage-MenuSideBar-ActivityPanel-Activity-border' />
  </div>
}

export { ActivityPanel, MainPaneActivity }
