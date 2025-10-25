describe('Cypress Playground', () => {
  beforeEach(() => {
    const now = new Date(Date.UTC(2019, 10, 9)) // The month starts at 0 (zero)
    cy.clock(now)
    cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
  })

  it('shows a promotional banner', () => {
    cy.get('#promotional-banner').should('be.visible')
  })

  it('clicks the Subscribe button and shows a success message', () => {
    cy.contains('button', 'Subscribe').click()

    cy.contains(
      '#success',
      "You've been successfully subscribed to our newsletter."
    ).should('be.visible')
  })

  it('types in an input which "signs" a form, then asserts it is signed', () => {
    cy.get('#signature-textarea').type('Felipe Barra')

    cy.contains('#signature', 'Felipe Barra').should('be.visible')
  })

  it('types in the signature field, checks the checkbox to see the preview, then unchecks it', () => {
    cy.get('#signature-textarea-with-checkbox').type('Felipe Barra')
    cy.get('#signature-checkbox').check().should('be.checked')

    cy.contains('#signature-triggered-by-check', 'Felipe Barra').should('be.visible')

    cy.get('#signature-checkbox').uncheck().should('not.be.checked')

    cy.contains('#signature-triggered-by-check', 'Felipe Barra').should('not.exist')
  })

  it('checks both possible radios and asserts if it is "ON" or "OFF"', () => {
    cy.contains('#on-off', 'ON').should('be.visible')

    cy.get('#off').check().should('be.checked')

    cy.contains('#on-off', 'OFF').should('be.visible')
    cy.contains('#on-off', 'ON').should('not.exist')

    cy.get('#on').check().should('be.checked')

    cy.contains('#on-off', 'ON').should('be.visible')
    cy.contains('#on-off', 'OFF').should('not.exist')
  })

  it('selects an option from the dropdown and asserts on the selection', () => {
    cy.contains('p', "You haven't selected a type yet.").should('be.visible')

    cy.get('#selection-type').select(3)

    cy.contains('p', "You've selected: VIP").should('be.visible')
  })

  it('selects a random option from the dropdown and asserts on the selection', () => {
    cy.contains('p', "You haven't selected a type yet.").should('be.visible')

    cy.get('#selection-type').find('option').then($options => {
      const randomIndex = Cypress._.random(1, $options.length - 1)
      const randomText = $options[randomIndex].innerText
      cy.get('#selection-type').select(randomText)
      cy.contains('p', `You've selected: ${randomText.toUpperCase()}`).should('be.visible')
    })
  })

  it('selects multiple fruits from the dropdown field and asserts on the selections', () => {
    cy.contains('p', "You haven't selected any fruit yet.").should('be.visible')

    cy.get('#fruit').select(['apple', 'banana', 'cherry', 'date', 'elderberry'])

    cy.contains('p', "You've selected the following fruits: apple, banana, cherry, date, elderberry")
      .should('be.visible')
  })

  it('uploads a file and asserts the corret file name appears as a paragraph', () => {
    cy.get('input[type="file"]').selectFile('./cypress/fixtures/example.json')

    cy.contains('p', 'The following file has been selected for upload: example.json')
      .should('be.visible')
  })

  it('uploads a file via drag-and-drop and asserts the corret file name appears as a paragraph', () => {
    cy.get('input[type="file"]').selectFile('./cypress/fixtures/example.json',
      { action: 'drag-drop' }
    )

    cy.contains('p', 'The following file has been selected for upload: example.json')
      .should('be.visible')
  })

  it('clicks a button and triggers a request', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', 'TODO ID: 1').should('be.visible')
    cy.contains('li', 'Title: delectus aut autem').should('be.visible')
    cy.contains('li', 'Completed: false').should('be.visible')
    cy.contains('li', 'User ID: 1').should('be.visible')
  })

  it('clicks a button and triggers a stubbed request', () => {
    const todo = require('../fixtures/todo')

    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { fixture: 'todo' }
    ).as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', `TODO ID: ${todo.id}`).should('be.visible')
    cy.contains('li', `Title: ${todo.title}`).should('be.visible')
    cy.contains('li', `Completed: ${todo.completed}`).should('be.visible')
    cy.contains('li', `User ID: ${todo.userId}`).should('be.visible')
  })

  it('clicks a button and simulates an API failure and shows an error message', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { statusCode: 500 }
    ).as('serverFailure')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@serverFailure')
      .its('response.statusCode')
      .should('be.equal', 500)

    cy.contains(
      '.error span',
      'Oops, something went wrong. Refresh the page and try again.'
    ).should('be.visible')
  })

  it('clicks a button and simulates a network failure and shows an error message', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { forceNetworkError: true }
    ).as('networkError')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@networkError')

    cy.contains(
      '.error span',
      'Oops, something went wrong. Check your internet connection, refresh the page, and try again.'
    ).should('be.visible')
  })

  it('simulates server/API failure and recovery', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { statusCode: 500 }
    ).as('serverFailure')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@serverFailure')
      .its('response.statusCode')
      .should('be.equal', 500)

    cy.contains(
      '.error span',
      'Oops, something went wrong. Refresh the page and try again.'
    ).should('be.visible')

    cy.reload()

    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { middleware: true }
    ).as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', 'TODO ID').should('be.visible')
    cy.contains('li', 'Title').should('be.visible')
    cy.contains('li', 'Completed').should('be.visible')
    cy.contains('li', 'User ID').should('be.visible')
  })

  it('makes a HTTP request and asserts on the returned status code', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .its('status')
      .should('be.equal', 200)
  })

  Cypress._.times(10, index => {
    it(`selects ${index + 1} out of 10`, () => {
      cy.get('input[type="range"]')
        .invoke('val', index + 1)
        .trigger('change')

      cy.contains('p', `You're on level: ${index + 1}`).should('be.visible')
    })
  })

  it('selects a date and asserts the correct date has been displayed', () => {
    cy.get('#date').type('2025-11-10').blur()

    cy.contains('p', `The date you've selected is: 2025-11-10`).should('be.visible')
  })

  it('types a password based on a protected environment variable', () => {
    cy.get('#password')
      .as('passwordField')
      .type(Cypress.env('user_password'), { log: false })

    cy.get('#show-password-checkbox').check()

    cy.get('@passwordField')
      .should('have.not.attr', 'type', 'password')
      .and('have.attr', 'type', 'text')
      .and('have.value', Cypress.env('user_password'))

    cy.get('#show-password-checkbox').uncheck()

    cy.get('@passwordField')
      .should('have.not.attr', 'type', 'text')
      .and('have.attr', 'type', 'password')
  })

  it('counts the number of animals in a list', () => {
    cy.get('ul#animals li').should('have.length', 5)
  })

  it('freezes the browser clock and asserts the frozen date is displayed', () => {
    cy.contains('p', 'Current date: 2019-11-09').should('be.visible')
  })

  it('copies the code, types it, submits it, then asserts on the success message', () => {
    cy.get('#timestamp')
      .then(element => {
        const code = element[0].innerText

        cy.get('#code').type(code)
        cy.contains('button', 'Submit').click()

        cy.contains('span', "Congrats! You've entered the correct code.").should('be.visible')
      })
  })

  it('types an incorrect code and asserts on the error message', () => {
    cy.get('#code').type('0000000000000')
    cy.contains('button', 'Submit').click()

    cy.contains('span', "The provided code isn't correct. Please, try again.").should('be.visible')
  })

  it('downloads a file, reads it, and asserts on its content', () => {
    cy.contains('a', 'Download a text file').click()

    cy.readFile('cypress/downloads/example.txt')
      .should('be.equal', 'Hello, World!')
  })
})