// Gujarati character handling

// Equivalent characters (ન = ણ, લ = ળ)
const equivalentChars: Record<string, string> = {
  'ણ': 'ન',
  'ળ': 'લ',
};

/**
 * ✅ આ ફંક્શન અક્ષરમાંથી માત્રા (કા, કિ, કી, વગેરે) દૂર કરીને 
 * મૂળ વ્યંજન (Base Consonant) આપશે.
 */
const getBaseCharacter = (word: string): string => {
  if (!word) return "";
  
  // Unicode range for Gujarati: \u0A80 to \u0AFF
  // Consonants stay, but marks (Matras) are stripped
  // Using normalize and regex to extract only the base consonant
  const firstChar = word.charAt(0);
  
  // If the character is a consonant with a matra (like કા, કિ, etc.), extract the base consonant
  if (word.length >= 2) {
    const consonant = word.charAt(0);
    const matra = word.charAt(1);
    
    // Check if the second character is a matra
    if (GUJARATI_MATRAS.includes(matra)) {
      return consonant;
    }
  }
  
  // જો પહેલો અક્ષર સ્વર અથવા વ્યંજન હોય, તો તેને જ રાખવો
  return firstChar;
};

// Normalize character (apply equivalents like ણ -> ન)
const normalizeChar = (char: string): string => {
  const base = getBaseCharacter(char);
  return equivalentChars[base] || base;
};

export const validateWord = (
  word: string,
  teamLetter: string,
  existingWords: string[]
): { isValid: boolean; isDuplicate: boolean; error?: string } => {
  const trimmedWord = word.trim();
  
  if (!trimmedWord) {
    return { isValid: false, isDuplicate: false, error: 'કૃપા કરીને શબ્દ બોલો' };
  }

  /**
   * ✅ બારાક્ષરી હેન્ડલિંગ:
   * જો "ટીમ લેટર" 'ક' હોય અને શબ્દ 'કેળા' હોય, 
   * તો 'કે' માંથી માત્રા કાઢીને તે 'ક' ગણાશે.
   */
  const firstChar = trimmedWord.charAt(0);
  const normalizedFirstChar = normalizeChar(firstChar);
  const normalizedRequired = normalizeChar(teamLetter);

  if (normalizedFirstChar !== normalizedRequired) {
    return { 
      isValid: false, 
      isDuplicate: false, 
      error: `શબ્દ "${teamLetter}" થી શરૂ થવો જોઈએ (તમે "${firstChar}" થી શરૂ થતો શબ્દ બોલ્યા)` 
    };
  }

  // Check for duplicate
  const normalizedExisting = existingWords.map(w => w.toLowerCase().trim());
  const normalizedNew = trimmedWord.toLowerCase();
  
  if (normalizedExisting.includes(normalizedNew)) {
    return { isValid: false, isDuplicate: true, error: 'આ શબ્દ પહેલેથી વપરાયેલ છે' };
  }

  return { isValid: true, isDuplicate: false };
};

// ✅ Team letter helper
export const getTeamLetter = (team: "A" | "B"): string => {
  return team === "A" ? "A" : "B";
};

// માત્રાઓ (Vowel signs)
export const GUJARATI_MATRAS = [
  'ા', 'િ', 'ી', 'ુ', 'ૂ', 'ે', 'ૈ', 'ો', 'ૌ', 'ં', 'ઃ', 'ઁ'
];

// સ્વર (Vowels)
export const GUJARATI_VOWELS = [
  'અ', 'આ', 'ઇ', 'ઈ', 'ઉ', 'ઊ', 'એ', 'ઐ', 'ઓ', 'ઔ'
];

// વ્યંજન (Consonants)
export const GUJARATI_CONSONANTS = [
  'ક', 'ખ', 'ગ', 'ઘ', 'ઙ',
  'ચ', 'છ', 'જ', 'ઝ', 'ઞ',
  'ટ', 'ઠ', 'ડ', 'ઢ', 'ણ',
  'ત', 'થ', 'દ', 'ધ', 'ન',
  'પ', 'ફ', 'બ', 'ભ', 'મ',
  'ય', 'ર', 'લ', 'ળ', 'વ',
  'શ', 'ષ', 'સ', 'હ'
];

// Complete Gujarati varakshari with all combinations (consonants + matras)
const generateFullVarakshari = () => {
  const varakshari = [...GUJARATI_VOWELS]; // Start with vowels
  
  // Add consonants
  varakshari.push(...GUJARATI_CONSONANTS);
  
  // Add consonant + matra combinations
  for (const consonant of GUJARATI_CONSONANTS) {
    for (const matra of GUJARATI_MATRAS) {
      // For each consonant, create combinations with each matra
      // Note: Not all combinations may be valid in Gujarati, but we include them for completeness
      if (matra === 'ા') varakshari.push(consonant + 'ા');
      if (matra === 'િ') varakshari.push(consonant + 'િ');
      if (matra === 'ી') varakshari.push(consonant + 'ી');
      if (matra === 'ુ') varakshari.push(consonant + 'ુ');
      if (matra === 'ૂ') varakshari.push(consonant + 'ૂ');
      if (matra === 'ે') varakshari.push(consonant + 'ે');
      if (matra === 'ૈ') varakshari.push(consonant + 'ૈ');
      if (matra === 'ો') varakshari.push(consonant + 'ો');
      if (matra === 'ૌ') varakshari.push(consonant + 'ૌ');
      if (matra === 'ં') varakshari.push(consonant + 'ં');
      if (matra === 'ઃ') varakshari.push(consonant + 'ઃ');
      if (matra === 'ઁ') varakshari.push(consonant + 'ઁ');
    }
  }
  
  return varakshari;
};

export const GUJARATI_VARAKSHARI = generateFullVarakshari();

// For game purposes, we might want just the base letters (consonants and vowels)
export const GAME_LETTERS = [...GUJARATI_CONSONANTS, ...GUJARATI_VOWELS];