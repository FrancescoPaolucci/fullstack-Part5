import React, { useState } from 'react'

const BlogDetails = ({ blogs, addLikes, elimina }) => {
  const [allVisible, setAllVisible] = useState(false)
  const hideWhenVisible = { display: allVisible ? 'none' : '' }
  const showWhenVisible = { display: allVisible ? '' : 'none' }

  return (
    <div id='blogdiv'>
      <div  className='Blogs' style={hideWhenVisible}>
        <p> {blogs.title}</p>
        <button id="showButton" onClick={() => setAllVisible(true)}>Show</button>
      </div>
      <div className='BlogDetails' style={showWhenVisible}>
        <p> Title: {blogs.title}</p>
        <p> Author: {blogs.author}</p>
        <p> URL: {blogs.url}</p>
        <p>
          {' '}
          Likes:{blogs.likes} <button id="LikeButton" className='LikeButton' onClick={addLikes}>Likes</button>
        </p>
        <p>
          <button id="deleteButton" onClick={elimina}>X Delete</button>
        </p>
        <p>
          <button onClick={() => setAllVisible(false)}>Hide</button>
        </p>
      </div>
    </div>
  )
}

export default BlogDetails
