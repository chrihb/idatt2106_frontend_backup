describe('Login Page Tests', () => {

    const userEmail = 'albert@example.com';
    const userPassword = 'password123';

    beforeEach(() => {
        cy.visit('/login');
    });

    it('displays the login form', () => {
        cy.contains('Logg Inn');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button').contains('Logg Inn').should('be.visible');
    });

    it('shows error on empty form submission', () => {
        cy.get('button').contains('Logg Inn').click();
        cy.contains('E-post');
        cy.contains('Passord');
    });

    it('shows error for invalid credentials', () => {
        cy.get('input[name="email"]').type('feil@example.com');
        cy.get('input[name="password"]').type('feilpassord');
        cy.get('button').contains('Logg Inn').click();
        cy.contains('Ugyldig e-post eller passord');
    });

    it('logs in with correct credentials', () => {
        cy.intercept('POST', '/api/login', {
            statusCode: 200,
            body: { success: true },
        }).as('loginRequest');

        cy.get('input[name="email"]').type(userEmail);
        cy.get('input[name="password"]').type(userPassword);
        cy.get('button').contains('Logg Inn').click();

        // cy.wait('@loginRequest');
        cy.url().should('include', '/');
    });

    it('navigates to registration page', () => {
        cy.contains('Registrer bruker').click();
        cy.url().should('include', '/register-account');
    });

    it('navigates to forgot password page', () => {
        cy.contains('Glemt passord?').click();
        cy.url().should('include', '/password-reset-request');
    });
});
