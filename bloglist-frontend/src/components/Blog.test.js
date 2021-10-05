import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogDetails from './Blog'
import BlogsForm from './BlogsForm'

test('renders only author', () => {
  const blog = {
    title:'Testing Blog',
    author:'Testing author',
    url:'testing url',
    likes: 0
  }

  const component = render(
    <BlogDetails blogs={blog} />
  )

  const div = component.container.querySelector('.Blogs')

  expect(div).toHaveTextContent(
    'Testing Blog'
  )


  expect(div).not.toHaveTextContent(
    'Testing author'
  )

  expect(div).not.toHaveTextContent(
    'testing url'
  )
  expect(div).not.toHaveTextContent(
    '0'
  )

})


describe('<BlogDetails />', () => {
  const blog = {
    title:'Testing Blog',
    author:'Testing author',
    url:'testing url',
    likes: 0
  }
  let component

  beforeEach(() => {
    component = render(
      <BlogDetails blogs={blog}/>
    )
  })


  test('at start the other information are hidden', () => {
    const div = component.container.querySelector('.BlogDetails')

    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('Show')
    fireEvent.click(button)

    const div = component.container.querySelector('.BlogDetails')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent(
      'Testing Blog'
    )
    expect(div).toHaveTextContent(
      'testing url'
    )
    expect(div).toHaveTextContent(
      'Testing author'
    )
    expect(div).toHaveTextContent(
      '0'
    )
  })

  test('clicking the button calls event handler twice', () => {
    const mockHandler = jest.fn()
    const component = render(
      <BlogDetails blogs={blog} addLikes={mockHandler}/>)
    const button = component.container.querySelector('.LikeButton')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)

  })

})

test('<BlogsForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogsForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const likes = component.container.querySelector('#likes')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Testing blogs' }
  })
  fireEvent.change(author, {
    target: { value: 'Testing Author' }
  })
  fireEvent.change(url, {
    target: { value: 'Testing url' }
  })
  fireEvent.change(likes, {
    target: { value: 0 }
  })


  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing blogs')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Testing url')
  expect(createBlog.mock.calls[0][0].likes).toBe(0)
})