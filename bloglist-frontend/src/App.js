import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
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
  const [newTitle, setTitle] = useState("");
  const [newAuthor, setAuthor] = useState("");
  const [newUrl, setUrl] = useState("");
  const [newLikes, setLikes] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessag] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes,
    };
    try {
      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setTitle("");
        setAuthor("");
        setUrl("");
        setLikes("");
        setNotificationMessag("Blog was correctly saved");
        setTimeout(() => {
          setNotificationMessag(null);
        }, 5000);
      });
    } catch (exception) {
      setErrorMessage("Can't save the blog check the info");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
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

  const noteForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title:{"   "}
        <input
          type="text"
          value={newTitle}
          onChange={({ target }) => {
            setTitle(target.value);
            console.log(target.value);
          }}
        />
      </div>
      Author:{" "}
      <input
        type="text"
        value={newAuthor}
        onChange={({ target }) => {
          setAuthor(target.value);
          console.log(target.value);
        }}
      />
      <div>
        Url:{" "}
        <input
          type="text"
          value={newUrl}
          onChange={({ target }) => {
            setUrl(target.value);
            console.log(target.value);
          }}
        />
      </div>
      likes:{" "}
      <input
        type="text"
        value={newLikes}
        onChange={({ target }) => {
          setLikes(target.value);
          console.log(target.value);
        }}
      />
      <div>
        <button type="submit">save blog</button>
      </div>
    </form>
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
          {noteForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
