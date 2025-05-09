describe('Navbar Tests', () => {

    it('displays the main page correctly', () => {
        cy.visit('/');
        cy.url().should('eq', 'http://localhost:5173/');
        cy.contains('Nyheter', { timeout: 10000 }).should('be.visible');
        cy.contains('Filter', { timeout: 10000 }).should('be.visible');
    });

    it('verifies navbar buttons exist on the main page', () => {
        cy.visit('/');
        cy.get('nav', { timeout: 10000 }).should('be.visible');
        cy.get('nav').contains('Lager').should('be.visible');
        cy.get('nav').contains('Husstand').should('be.visible');
        cy.get('nav').contains('Nyheter').should('be.visible');
        cy.get('nav').contains('Kart').should('be.visible');
    });

    it('navigates to Nyheter page without login', () => {
        cy.visit('/news');
        cy.url().should('eq', 'http://localhost:5173/news');
        cy.contains('Nyheter').should('be.visible');
        cy.contains('Velg Distrikt').should('be.visible');
        cy.get('nav').should('be.visible');
    });

    it('navigates to Kart page without login', () => {
        cy.visit('/map');
        cy.url().should('eq', 'http://localhost:5173/map');
        cy.contains('Filter').should('be.visible');
        cy.get('nav').should('be.visible');
    });

    it('requires login to access Lager page', () => {
        cy.visit('/storage/list');
        cy.url({ timeout: 10000 }).should('include', '/login?redirect=/storage/list');
        cy.contains('Logg Inn').should('be.visible');
    });

    it('requires login to access Husstand page', () => {
        cy.visit('/household/list');
        cy.url({ timeout: 10000 }).should('include', '/login?redirect=/household/list');
        cy.contains('Logg Inn').should('be.visible');
    });

    it('displays login link when not authenticated', () => {
        cy.visit('/');
        cy.contains('Logg Inn', { timeout: 10000 }).should('be.visible');
    });

});