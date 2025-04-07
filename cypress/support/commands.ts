// cypress/support/commands.ts
/// <reference types="cypress" />

// Import testing library commands for better selecting elements
import '@testing-library/cypress/add-commands';

// Extend Cypress with custom commands

// Command to toggle the theme
Cypress.Commands.add('toggleTheme', () => {
  cy.get('button').first().click();
});

// Command to open help box
Cypress.Commands.add('openHelp', () => {
  // Click help button (usually the second button in navbar)
  cy.get('nav').find('button').eq(1).click();
});

// Command to close help box
Cypress.Commands.add('closeHelp', () => {
  // Click outside the help box
  cy.get('body').click(10, 10);
});

// Add support for checking custom transforms
Cypress.Commands.add('shouldHaveTransform', { prevSubject: true }, (subject, value) => {
  cy.wrap(subject)
    .should('have.css', 'transform')
    .and((transform) => {
      expect(transform).to.include(value);
    });
});

// Command to check if element is visible after scroll
Cypress.Commands.add('shouldBeVisibleAfterScroll', { prevSubject: true }, (subject) => {
  cy.wrap(subject).scrollIntoView();
  cy.wrap(subject).should('be.visible');
});

// Extend Cypress Chainable interface with custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      toggleTheme(): Chainable<Element>;
      openHelp(): Chainable<Element>;
      closeHelp(): Chainable<Element>;
      shouldHaveTransform(value: string): Chainable<Element>;
      shouldBeVisibleAfterScroll(): Chainable<Element>;
    }
  }
}
