import React, { useState } from 'react'

const BlogsForm = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')
  const [newLikes, setLikes] = useState(0)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (
    <div className="formDiv">
      <h2> Create a new Blog </h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            id='title'
            type="text"
            value={newTitle}
            onChange={({ target }) => {
              setTitle(target.value)
              console.log(target.value)
            }}
          />
        </div>
        Author:{' '}
        <input
          id='author'
          type="text"
          value={newAuthor}
          onChange={({ target }) => {
            setAuthor(target.value)
            console.log(target.value)
          }}
        />
        <div>
          Url:{' '}
          <input
            id='url'
            type="text"
            value={newUrl}
            onChange={({ target }) => {
              setUrl(target.value)
              console.log(target.value)
            }}
          />
        </div>
        likes:{' '}
        <input
          id='likes'
          type="text"
          value={newLikes}
          onChange={({ target }) => {
            setLikes(target.value)
            console.log(target.value)
          }}
        />
        <div>
          <button type="submit">save blog</button>
        </div>
      </form>
    </div>
  )
}

export default BlogsForm
