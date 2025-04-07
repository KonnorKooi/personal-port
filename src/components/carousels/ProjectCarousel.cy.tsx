import React from 'react';
import ProjectCarousel from './ProjectCarousel';
import { ThemeProvider } from '../ThemeProvider';
import { projects } from '../../utils/constants';

describe('<ProjectCarousel />', () => {
  beforeEach(() => {
    // Mount the component
    cy.mount(
      <ThemeProvider>
        <ProjectCarousel />
      </ThemeProvider>
    );
    
    // Force all cards into view to trigger animations
    cy.get('a[data-testid="project-card"]').each(($card) => {
      // Force the card to be in view to trigger the animation
      cy.wrap($card).scrollIntoView({ ensureScrollable: false });
      cy.wait(50); // Small wait to let scroll complete
    });
    
    // Wait for animations to complete
    cy.wait(500);
  });

  it('renders all project cards with correct details', () => {
    // Should have the right number of cards
    cy.get('a[data-testid="project-card"]').should('have.length', projects.length);
    
    // Check each card's content
    cy.get('a[data-testid="project-card"]').each(($card, index) => {
      // By now cards should be visible
      cy.wrap($card).should('have.css', 'opacity', '1');
      
      // Cards should be clickable (no pointer-events: none)
      cy.wrap($card).should('not.have.css', 'pointer-events', 'none');
      
      // Check content
      cy.wrap($card).find('h3').should('contain', projects[index].title);
      cy.wrap($card).find('p').should('contain', projects[index].date);
      
      // Since the card itself is the link, check href directly
      cy.wrap($card).should('have.attr', 'href', projects[index].link);
    });
  });

  it('project links open in a new tab', () => {
    // The cards themselves are the links
    cy.get('a[data-testid="project-card"]').each(($card) => {
      cy.wrap($card).should('have.attr', 'target', '_blank');
      cy.wrap($card).should('have.attr', 'rel', 'noopener noreferrer');
    });
  });
  
});