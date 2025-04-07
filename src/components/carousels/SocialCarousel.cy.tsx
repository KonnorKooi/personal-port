import React from 'react';
import SocialCarousel from './SocialCarousel';
import { ThemeProvider } from '../ThemeProvider';
import { socials } from '../../utils/constants';

describe('<SocialCarousel />', () => {
  beforeEach(() => {
    // Mount component with ThemeProvider
    cy.mount(
      <ThemeProvider>
        <SocialCarousel />
      </ThemeProvider>
    );
    
    // Force all social cards into view to trigger animations
    cy.get('a').each(($card) => {
      cy.wrap($card).scrollIntoView({ ensureScrollable: false });
      cy.wait(50); // Small wait to let scroll complete
    });
    
    // Wait for animations to complete
    cy.wait(500);
  });

  it('renders the correct title', () => {
    cy.contains('h2', 'Socials').should('be.visible');
  });

  it('renders all social cards with correct content', () => {
    // Should have the right number of social cards
    cy.get('a').should('have.length', socials.length);
    
    // Check each card
    socials.forEach((social, index) => {
      // Get the card at this index
      cy.get('a').eq(index).within(() => {
        // Should have the image with correct attributes
        cy.get('img').should('have.length.at.least', 1);
        
        // Should contain the correct social name
        cy.contains(social.name).should('be.visible');
        
        // Check href attribute
        cy.root().should('have.attr', 'href', social.link);
        
        // Check target attribute for external links
        cy.root().should('have.attr', 'target', '_blank');
        cy.root().should('have.attr', 'rel', 'noopener noreferrer');
      });
    });
  });

  it('social cards have correct styling and animations', () => {
    // Check for visible cards (opacity should be 1 after animation)
    cy.get('a').each(($card) => {
      cy.wrap($card).should('have.css', 'opacity', '1');
      cy.wrap($card).should('have.css', 'transform').and('not.include', 'translate');
    });
    
    // Check hover effect
    cy.get('a').first().realHover();
    cy.get('a').first().should('have.css', 'transform').and('include', 'scale');
  });

  it('adapts to theme changes', () => {
    // Find theme toggle button in the parent document (assuming it's in the Navbar)
    cy.get('button').first().as('themeToggle');
    
    // Check initial background (dark theme)
    cy.get('div').contains('h2', 'Socials').parent().parent()
      .should('have.class', 'bg-black');
    
    // Toggle theme
    cy.get('@themeToggle').click();
    
    // Check updated background (light theme)
    cy.get('div').contains('h2', 'Socials').parent().parent()
      .should('have.class', 'bg-white');
  });
});
