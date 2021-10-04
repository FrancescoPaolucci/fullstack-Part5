import React, { useState } from "react";

const BlogDetails = ({ blogs }) => {
  const [allVisible, setAllVisible] = useState(false);
  const hideWhenVisible = { display: allVisible ? "none" : "" };
  const showWhenVisible = { display: allVisible ? "" : "none" };

  return (
    <div>
      <div style={hideWhenVisible}>
        <p> {blogs.title}</p>
        <button onClick={() => setAllVisible(true)}>Show</button>
      </div>
      <div style={showWhenVisible}>
        <p> Title: {blogs.title}</p>
        <p> Author: {blogs.author}</p>
        <p> URL: {blogs.url}</p>
        <p> Likes:{blogs.likes}</p>
        <p>
          <button onClick={() => setAllVisible(false)}>Hide</button>
        </p>
      </div>
    </div>
  );
};

export default BlogDetails;
