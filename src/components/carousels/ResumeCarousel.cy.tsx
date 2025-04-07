import React from 'react';
import ResumeCarousel from './ResumeCarousel';
import { ThemeProvider } from '../ThemeProvider';
import * as googleDocsUtils from '../../utils/googleDocsUtils';

// Sample resume data for testing
const mockResumes = [
  {
    id: "1_PCsLoXaewjx_s07PgO-rB0OxMiV2ruG18oziB26rmI", 
    title: "General Resume",
    description: "For most applications",
    thumbnailUrl: "/images/resumes/Konnor Kooi Resume-1_page-0001.jpg",
    docLink: "https://docs.google.com/document/d/1_PCsLoXaewjx_s07PgO-rB0OxMiV2ruG18oziB26rmI/view"
  },
  {
    id: "1fcs6enL0wO35B7PbseVKFEE-sNNh04JB2lXxassaXJY", 
    title: "Web & Cloud Resume",
    description: "For web development & cloud positions",
    thumbnailUrl: "/images/resumes/Konnor Kooi Resume for web data and cloud_page-0001.jpg",
    docLink: "https://docs.google.com/document/d/sNNh04JB2lXxassaXJY/view"
  },
  {
    id: "1GqBGBLSzc4bj1OHDtC3ytuE8aujHaW_VjYyJC3QT1xI",
    title: "Embedded Systems Resume",
    description: "For embedded & low-level positions",
    thumbnailUrl: "/images/resumes/Konnor Kooi for Embeded and Low Level_page-0001.jpg",
    docLink: "https://docs.google.com/document/d/1GqBGBLSzc4bj1OHDtC3ytuE8aujHaW_VjYyJC3QT1xI/view"
  }
];

describe('<ResumeCarousel />', () => {
  beforeEach(() => {
    // Stub the getResumes function to return mock data
    cy.stub(googleDocsUtils, 'getResumes').returns(mockResumes);
    
    // Mount component
    cy.mount(
      <ThemeProvider>
        <ResumeCarousel />
      </ThemeProvider>
    );
    
    // Force resume cards into view to trigger animations
    cy.get('div.h-96').each(($card) => {
      cy.wrap($card).scrollIntoView({ ensureScrollable: false });
      cy.wait(50);
    });
    
    // Wait for animations to complete
    cy.wait(500);
  });

  it('renders the correct title', () => {
    cy.contains('h2', 'Resumes').should('be.visible');
  });

  it('renders all resume cards with correct content', () => {
    // Should have the right number of resume cards
    cy.get('div.h-96').should('have.length', mockResumes.length);
    
    // Check each card
    mockResumes.forEach((resume, index) => {
      // Get the card at this index
      cy.get('div.h-96').eq(index).within(() => {
        // Should have the image
        cy.get('img').should('exist');
        
        // Should contain the correct resume title
        cy.contains(resume.title).should('be.visible');
        
        // Should contain the description
        cy.contains(resume.description).should('be.visible');
        
        // Should have the "Click to view" text
        cy.contains('Click to view full resume').should('be.visible');
      });
    });
  });

});
