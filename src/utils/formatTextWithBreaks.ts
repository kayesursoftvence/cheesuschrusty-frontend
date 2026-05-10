// /**
//  * Formats a block of text by handling literal "\n" line breaks and adding
//  * consistent indentation for bullets and numbered items.
//  *
//  * @param text - The input string that may contain literal "\n" or actual newlines.
//  * @returns The formatted string with proper line breaks, bullets, and numbers.
//  */
// export default function formatTextWithBreaks(text: string | null | undefined): string {
//     if (!text) return '';
  
//     // Replace literal "\n" with actual newline characters
//     const normalizedText = text.replace(/\\n/g, '\n');
  
//     const lines = normalizedText.split('\n');
  
//     const formattedLines = lines.map((line) => {
//       const trimmedLine = line.trim();
  
//       // Handle bullet points starting with "- " or "• "
//       if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
//         return `  • ${line.substring(2).trim()}`;
//       }
  
//       // Handle numbered lists like "1. Item"
//       const numberedMatch = trimmedLine.match(/^(\d+)\.\s(.+)/);
//       if (numberedMatch) {
//         return `  ${numberedMatch[1]}. ${numberedMatch[2]}`;
//       }
  
//       // Return other lines as-is
//       return line;
//     });
  
//     return formattedLines.join('\n');
//   }

  