import React from 'react';

describe('Home Page Integration', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/');
    
    // Give time for all components to render
    cy.wait(500);
  });

  it('renders all major sections of the page', () => {
    // Navbar
    cy.get('nav').should('be.visible');
    cy.contains('Konnor Kooi').should('be.visible');
    
    // Projects section
    cy.contains('h2', 'Projects').should('be.visible');
    
    // Resume section (if implemented)
    cy.contains('h2', 'Resumes').should('exist');
    
    // Socials section
    cy.contains('h2', 'Socials').should('be.visible');
    
    // Footer
    cy.get('footer').should('be.visible');
    cy.get('footer').contains('WWU Computer Science').should('be.visible');
  });

  it('theme toggle affects the entire page', () => {
    // Find theme toggle button
    cy.get('nav').find('button').first().as('themeToggle');
    
    // Store initial theme
    let initialBg;
    cy.get('body').then(($body) => {
      initialBg = $body.css('background-color');
    });
    
    // Toggle theme
    cy.get('@themeToggle').click();
    
    // Check that theme changes propagate throughout the page
    cy.get('body').should('not.have.css', 'background-color', initialBg);
    
    // Project cards should reflect theme change
    cy.get('a').first().should('be.visible');
  });

  it('checks project card links and attributes', () => {
    // Scroll to Projects section
    cy.contains('h2', 'Projects').scrollIntoView();
    
    // Get all project cards
    cy.get('a').each(($card) => {
      // Each card should have an href attribute
      cy.wrap($card).should('have.attr', 'href');
      
      // Each card with an href starting with http should open in a new tab
      const href = $card.attr('href');
      if (href && href.startsWith('http')) {
        cy.wrap($card).should('have.attr', 'target', '_blank');
        cy.wrap($card).should('have.attr', 'rel', 'noopener noreferrer');
      }
    });
  });

  it('checks social links in footer', () => {
    // Check social links in footer
    cy.get('footer').find('a').each(($link) => {
      cy.wrap($link).should('have.attr', 'href');
      cy.wrap($link).should('have.attr', 'target', '_blank');
      cy.wrap($link).should('have.attr', 'rel', 'noopener noreferrer');
    });
  });

  it('help button in navbar opens and closes correctly', () => {
  // Find the help button (typically the second button with an SVG icon)
  cy.get('nav').find('button').last().as('helpButton');
  
  // Click the help button
  cy.get('@helpButton').click();
  
  // Check for help box - try a more generic selector in case the id is different
  // Let's look for a div that appears after clicking that contains "Project Information"
  cy.contains('Project Information').should('be.visible');
  cy.contains('Next.js').should('be.visible');
  cy.contains('Tailwind CSS').should('be.visible');
  
  // Click outside to close (clicking on the body away from the popup)
  cy.get('body').click(10, 10);
  
  // Verify the help box is gone
  cy.contains('Project Information').should('not.exist');
});

  it('scrolls through page sections', () => {
    // Scroll to Projects section
    cy.contains('h2', 'Projects').scrollIntoView();
    cy.contains('h2', 'Projects').should('be.visible');
    
    // Scroll to Socials section
    cy.contains('h2', 'Socials').scrollIntoView();
    cy.contains('h2', 'Socials').should('be.visible');
  });
});
