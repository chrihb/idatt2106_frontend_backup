describe('Homepage', () => {
    it('loads the home page', () => {
        cy.visit('/')
        cy.contains('Welcome') // Adjust to something actually on your homepage
    })
})
