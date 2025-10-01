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
})