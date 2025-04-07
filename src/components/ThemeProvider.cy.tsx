import React from 'react';
import { ThemeProvider, useTheme } from './ThemeProvider';

// Simple test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div data-testid="theme-test-component">
      <div data-testid="current-theme">{theme}</div>
      <button 
        data-testid="theme-toggle-button" 
        onClick={toggleTheme}
      >
        Toggle Theme
      </button>
    </div>
  );
};

describe('<ThemeProvider />', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    
    // Mock localStorage for controlled testing
    const localStorageMock = {
      getItem: cy.stub().returns(null),
      setItem: cy.stub(),
      clear: cy.stub(),
      removeItem: cy.stub(),
      length: 0,
      key: cy.stub()
    };
    
    cy.window().then((win) => {
      Object.defineProperty(win, 'localStorage', {
        value: localStorageMock
      });
    });
    
    // Mount the component
    cy.mount(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
  });

  it('provides theme context to child components', () => {
    // Test component should render
    cy.get('[data-testid="theme-test-component"]').should('exist');
    
    // Default theme should be dark
    cy.get('[data-testid="current-theme"]').should('have.text', 'dark');
  });

  it('toggles theme when toggleTheme is called', () => {
    // Default theme should be dark
    cy.get('[data-testid="current-theme"]').should('have.text', 'dark');
    
    // Click toggle button
    cy.get('[data-testid="theme-toggle-button"]').click();
    
    // Theme should be light
    cy.get('[data-testid="current-theme"]').should('have.text', 'light');
    
    // Click toggle button again
    cy.get('[data-testid="theme-toggle-button"]').click();
    
    // Theme should be dark again
    cy.get('[data-testid="current-theme"]').should('have.text', 'dark');
  });

  it('persists theme in localStorage', () => {
    // Start with dark theme
    cy.get('[data-testid="current-theme"]').should('have.text', 'dark');
    
    // Mock localStorage.setItem to track calls
    cy.window().then((win) => {
      cy.spy(win.localStorage, 'setItem').as('setItemSpy');
    });
    
    // Toggle theme
    cy.get('[data-testid="theme-toggle-button"]').click();
    
    // Theme should be stored in localStorage
    cy.get('@setItemSpy').should('be.calledWith', 'theme', 'light');
  });

  it('applies theme classes to document', () => {
    // Initial state - dark theme
    cy.document().then((doc) => {
      expect(doc.documentElement.classList.contains('dark')).to.be.true;
      expect(doc.documentElement.classList.contains('light')).to.be.false;
    });
    
    // Toggle theme
    cy.get('[data-testid="theme-toggle-button"]').click();
    
    // Check updated state - light theme
    cy.document().then((doc) => {
      expect(doc.documentElement.classList.contains('light')).to.be.true;
      expect(doc.documentElement.classList.contains('dark')).to.be.false;
    });
  });

  it('changes body styles based on theme', () => {
    // Initial state - dark theme
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)'); // #000000
    cy.get('body').should('have.css', 'color', 'rgb(255, 255, 255)'); // #ffffff
    
    // Toggle theme
    cy.get('[data-testid="theme-toggle-button"]').click();
    
    // Light theme
    cy.get('body').should('have.css', 'background-color', 'rgb(255, 255, 255)'); // #ffffff
    cy.get('body').should('have.css', 'color', 'rgb(0, 0, 0)'); // #000000
  });
});
