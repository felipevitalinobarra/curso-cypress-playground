describe('Cypress Playground', () => {
  beforeEach(() => {
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
})