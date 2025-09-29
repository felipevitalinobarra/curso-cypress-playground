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
})