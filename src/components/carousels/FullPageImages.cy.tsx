import React from 'react';
import FullPageImages from './FullPageImages';
import { ThemeProvider } from '../ThemeProvider';
import { largeProjects } from '../../utils/constants';

describe('<FullPageImages />', () => {
  beforeEach(() => {
    // Stub IntersectionObserver
    cy.window().then((win) => {
      // Create mock IntersectionObserver that always reports everything as visible
      win.IntersectionObserver = function(callback) {
        this.observe = (element) => {
          callback([{
            isIntersecting: true,
            target: element
          }], this);
        };
        this.disconnect = () => {};
        this.unobserve = () => {};
      };
    });
    
    cy.mount(
      <ThemeProvider>
        <FullPageImages />
      </ThemeProvider>
    );
  });

  it('renders all full-page sections', () => {
    // Should have the correct number of sections
    cy.get('div.min-h-screen').should('have.length', largeProjects.length);
  });

  it('each section contains the correct content and images', () => {
    largeProjects.forEach((project, index) => {
      // Get the section at this index
      cy.get('div.min-h-screen').eq(index).within(() => {
        // Check for image
        cy.get('img').should('exist');
        
        // Check for title
        cy.contains('h2', project.title).should('be.visible');
        
        // If the project has a subtitle, check for it
        if (project.subtitle) {
          cy.contains('h3', project.subtitle).should('be.visible');
        }
        
        // If the project has a description, check for it
        if (project.description) {
          cy.contains('p', project.description).should('be.visible');
        }
      });
    });
  });

  it('images have proper attributes', () => {
    cy.get('img').each(($img) => {
      // Each image should have appropriate attributes
      cy.wrap($img).should('have.attr', 'alt');
      cy.wrap($img).should('have.attr', 'style').and('include', 'object-fit');
    });
  });
});
