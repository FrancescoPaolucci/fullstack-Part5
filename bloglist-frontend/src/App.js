import React, { useState, useEffect, useRef } from 'react'
import BlogDetails from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable.js'
import BlogsForm from './components/BlogsForm'
import './index.css'
const Error = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className="error">{message}</div>
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className="notification">{message}</div>
}
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessag] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogsFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs)
    })
  }, [])
  console.log(blogs[3])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogsFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedBLog) => {
      setBlogs(blogs.concat(returnedBLog))
      setNotificationMessag('Blogg added succesfully')
      setTimeout(() => {
        setNotificationMessag(null)
      }, 5000)
    })
  }

  const addLikesAt = (id) => {
    const blog = blogs.find((b) => b.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      })
      .catch((error) => {
        setErrorMessage('Something went wrong')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const eliminaAt = (id) => {
    const blog = blogs.find((b) => b.id === id)
    if (
      window.confirm(`Do you really want to delete this blog = ${blog.name}?`)
    ) {
      blogService
        .elimina(id)
        .then((res) => {
          const blogD = blogs.filter((b) => b.id !== id)
          setBlogs(blogD)
          setNotificationMessag(`Blog ${blog} was deleted`)
          setTimeout(() => {
            setNotificationMessag(null)
          }, 5000)
        })
        .catch((error) => {
          setErrorMessage(
            `Blog: ${blog.name} was already deleted or doesn't exist`
          )
          const blogD = blogs.filter((b) => b.id !== id)
          setBlogs(blogD)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => {
            setUsername(target.value)
            console.log(target.value)
          }}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogsForm = () => (
    <Togglable buttonLabel="Add New Blog" ref={blogsFormRef}>
      <BlogsForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Error message={errorMessage} />
      <Notification message={notificationMessage} />
      {user === null ? (
        <div>{loginForm()}</div>
      ) : (
        <div>
          <p>
            {user.name} logged in{' '}
            <button
              onClick={() => {
                window.localStorage.clear()
                setUser(null)
              }}
            >
              Log out
            </button>
          </p>
          <div>{blogsForm()}</div>
          <div>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((value) => (
                <BlogDetails
                  key={value.id}
                  blogs={value}
                  addLikes={() => addLikesAt(value.id)}
                  elimina={() => eliminaAt(value.id)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
