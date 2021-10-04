import React, { useState, useEffect, useRef } from "react";
import BlogDetails from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable.js";
import BlogsForm from "./components/BlogsForm";
import "./index.css";
const Error = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="error">{message}</div>;
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="notification">{message}</div>;
};
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessag] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogsFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);
  console.log(blogs[3]);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (blogObject) => {
    blogsFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBLog) => {
      setBlogs(blogs.concat(returnedBLog));
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleShowButton = (e) => {
    console.log("id:", e.target.value);
    const result = blogs.filter((value) => {
      return value.id === e.target.value;
    });
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => {
            setUsername(target.value);
            console.log(target.value);
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
  );

  const blogsForm = () => (
    <Togglable buttonLabel="new Blog" ref={blogsFormRef}>
      <BlogsForm createBlog={addBlog} />
    </Togglable>
  );

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
            {user.name} logged in{" "}
            <button
              onClick={() => {
                window.localStorage.clear();
                setUser(null);
              }}
            >
              Log out
            </button>
          </p>
          <div>{blogsForm()}</div>
          <div>
            {blogs.map((value) => (
              <BlogDetails keys={value.id} blogs={value} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
