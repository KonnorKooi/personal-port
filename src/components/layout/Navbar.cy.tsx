import React from 'react';
import Navbar from './Navbar';
import { ThemeProvider } from '../ThemeProvider';

describe('<Navbar />', () => {
  beforeEach(() => {
    // Mock localStorage for theme storage
    const localStorageMock = {
      getItem: cy.stub().returns('dark'),
      setItem: cy.stub(),
      clear: cy.stub()
    };
    cy.window().then((win) => {
      win.localStorage.clear();
      Object.defineProperty(win, 'localStorage', {
        value: localStorageMock
      });
    });
    
    // Mount the component within ThemeProvider
    cy.mount(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
  });

  it('renders logo and name correctly', () => {
    // Check for logo
    cy.get('nav').find('img').should('be.visible');
    
    // Check for name
    cy.contains('Konnor Kooi').should('be.visible');
  });

  it('toggles help box when help button is clicked', () => {
    // Help box should not be visible initially
    cy.get('[id="helpBox"]').should('not.exist');
    
    // Click help button
    cy.get('button').last().click();
    
    // Help box should now be visible
    cy.get('[id="helpBox"]').should('be.visible');
    cy.get('[id="helpBox"]').contains('Project Information').should('be.visible');
    cy.get('[id="helpBox"]').contains('React').should('be.visible');
    cy.get('[id="helpBox"]').contains('Next.js').should('be.visible');
    cy.get('[id="helpBox"]').contains('Tailwind CSS').should('be.visible');
    
    // Click outside to close help box
    cy.get('nav').click('topLeft');
    
    // Help box should be hidden again
    cy.get('[id="helpBox"]').should('not.exist');
  });

  it('theme toggle button is present and functional', () => {
    // Find theme toggle button (button with Sun or Moon icon)
    cy.get('button').first().as('themeToggle');
    cy.get('@themeToggle').should('be.visible');
    
    // In dark mode by default, icon should be Sun
    cy.get('@themeToggle').find('svg').should('exist');
    
    // Store initial theme
    let initialTheme;
    cy.document().then((doc) => {
      initialTheme = doc.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    
    // Click theme toggle
    cy.get('@themeToggle').click();
    
    // Verify theme changed
    cy.document().then((doc) => {
      const newTheme = doc.documentElement.classList.contains('dark') ? 'dark' : 'light';
      expect(newTheme).not.to.equal(initialTheme);
    });
  });

  it('navbar has correct color scheme based on theme', () => {
    // Check initial theme (dark)
    cy.get('nav').should('have.class', 'bg-black');
    
    // Toggle theme
    cy.get('button').first().click();
    
    // Check updated theme (light)
    cy.get('nav').should('have.class', 'bg-white');
  });
});
