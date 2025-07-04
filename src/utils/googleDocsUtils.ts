// src/utils/googleDocsUtils.ts

export interface GoogleDocResume {
  id: string;         // Google Doc ID or full URL
  title: string;      // Display title for the resume
  description: string; // Short description
  thumbnailUrl: string; // Path to the preview image
  docLink?: string;    // Optional direct link to the document
}

/**
 * Extracts the document ID from a Google Docs URL
 * @param url The full Google Docs URL
 * @returns The document ID
 */
export const extractDocId = (url: string): string => {
  // Check if the input is already just an ID (not a URL)
  if (!url.includes('docs.google.com')) {
    return url;
  }

  // Example URL: https://docs.google.com/document/d/1ABC123-example-id/edit?usp=sharing
  const regex = /\/document\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  throw new Error('Invalid Google Docs URL format');
};

/**
 * Converts a regular view/edit URL to a publicly viewable URL
 * @param docIdOrUrl The Google Doc ID or full URL
 * @returns Public URL for viewing the document
 */
export const getGoogleDocPublicUrl = (docIdOrUrl: string): string => {
  // If it's already a full URL, just ensure it's a view URL
  if (docIdOrUrl.includes('docs.google.com')) {
    // Convert edit URL to view URL
    return docIdOrUrl.replace(/\/edit.*$/, '/view');
  }
  
  // Otherwise, treat it as just an ID
  return `https://docs.google.com/document/d/${docIdOrUrl}/view`;
};

/**
 * Returns data for your resumes
 */
export const getResumes = (): GoogleDocResume[] => {
  return [
    {
      id: "1_PCsLoXaewjx_s07PgO-rB0OxMiV2ruG18oziB26rmI", 
      title: "General Resume",
      description: "For most applications",
      thumbnailUrl: "/images/resumes/Konnor Kooi Resume-1_page-0001.jpg",
      docLink: "https://docs.google.com/document/d/1_PCsLoXaewjx_s07PgO-rB0OxMiV2ruG18oziB26rmI/view"
    },
    // {
    //   id: "1fcs6enL0wO35B7PbseVKFEE-sNNh04JB2lXxassaXJY", 
    //   title: "Web & Cloud Resume",
    //   description: "For web development & cloud positions",
    //   thumbnailUrl: "/images/resumes/Konnor Kooi Resume for web data and cloud_page-0001.jpg",
    //   docLink: "https://docs.google.com/document/d/sNNh04JB2lXxassaXJY/view"
    // },
    // {
    //   id: "1GqBGBLSzc4bj1OHDtC3ytuE8aujHaW_VjYyJC3QT1xI",
    //   title: "Embedded Systems Resume",
    //   description: "For embedded & low-level positions",
    //   thumbnailUrl: "/images/resumes/Konnor Kooi for Embeded and Low Level_page-0001.jpg",
    //   docLink: "https://docs.google.com/document/d/1GqBGBLSzc4bj1OHDtC3ytuE8aujHaW_VjYyJC3QT1xI/view"
    // }
  ];
};