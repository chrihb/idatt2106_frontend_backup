describe('Emergency Storage', () => {
  it('loads the emergency storage page', () => {
    cy.visit('/emergency-storage')
    cy.contains('Emergency Storage')
  })

  it('loads emergency items', () => {
    cy.visit('http://localhost:8080/api/emergency-items')
    cy.intercept('GET', '/api/emergency-storage/items').as('getItems')
    cy.wait('@getItems').then((interception) => {
      assert.equal(interception.response.statusCode, 200, 'Status code is 200')
    })
  })
});