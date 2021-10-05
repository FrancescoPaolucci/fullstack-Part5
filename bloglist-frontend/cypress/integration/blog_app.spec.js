describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'wayne',
      password: 'wayne'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function() {
    cy.contains('login').click()
    cy.get('#username').type('wayne')
    cy.get('#password').type('wayne')
    cy.get('#login-button').click()
    cy.contains('logged in')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('wayne')
      cy.get('#password').type('wayne')
      cy.get('#login-button').click()
      cy.contains('logged in')

    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong')
      cy.get('#password').type('credential')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    describe('And a blogs exist', function(){
      beforeEach(function() {
        cy.get('#username').type('wayne')
        cy.get('#password').type('wayne')
        cy.get('#login-button').click()
        cy.contains('Add New Blog').click()
        cy.get('#title').type('PEROZZIIIIII')
        cy.get('#author').type('Wayne Rooney')
        cy.get('#url').type('www.wayne.com')
        cy.get('#likes').type(12)
        cy.contains('save blog').click()
      })
      it('A blog can be created', function() {
        cy.contains('Blogg added succesfully')
        cy.contains('PEROZZIIIIII')

      })
      it('A blog can be liked ', function(){
        cy.get('#showButton').click()
        cy.contains('Likes:12')
        cy.get('#LikeButton').click()
        cy.contains('Likes:13')
      })
      it('a blog can be deleted', function(){
        cy.get('#showButton').click()
        cy.get('#deleteButton').click()
        cy.contains('Blog PEROZZIIIIII was deleted')
      })
      it('a blog can not be deleted by another person',function(){
        cy.contains('Log out').click()
        const user = {
          username: 'wayne2',
          password: 'wayne2'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.get('#username').type('wayne2')
        cy.get('#password').type('wayne2')
        cy.get('#login-button').click()
        cy.contains('logged in')
        cy.get('#showButton').click()
        cy.get('#deleteButton').click()
        cy.contains('you don\'t have permission')
      })
      it('More blogs are sorted', function(){
        // cy.createBlog({title:'Bycyasaas', url:'roondasdye', author:'dsfsfsdf', likes:'12'})
        cy.contains('Add New Blog').click()
        cy.get('#title').type('PEROZZIIIIII1')
        cy.get('#author').type('Wayne Rooneyasd')
        cy.get('#url').type('www.wayne.csom')
        cy.get('#likes').type(1)
        cy.contains('save blog').click()
        cy.contains('Add New Blog').click()
        cy.get('#title').type('PEROZZIIIIII3')
        cy.get('#author').type('Wayne Rooneysddssdasd')
        cy.get('#url').type('www.wayne.csosdsdm')
        cy.get('#likes').type(1)
        cy.contains('save blog').click()
        cy.get('#showButton').then(buttons => {
          console.log('number of show buttons', buttons.length)
          cy.wrap(buttons[0].click())
          cy.get('#LikeButton').click()
        })
        cy.get('#blogdiv').then(blogs => {
          const title = blogs.map(el => el.title)
          cy.wrap(title).should('equal', ['PEROZZIIIIII','PEROZZIIIIII1','PEROZZIIIIII3'])

        })
      })

    })
  })
})