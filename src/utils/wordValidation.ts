// Gujarati character handling

// Equivalent characters (ન = ણ, લ = ળ)
const equivalentChars: Record<string, string> = {
  'ણ': 'ન',
  'ળ': 'લ',
};

// Get the base character (without matras)
const getBaseCharacter = (char: string): string => {
  return char.charAt(0);
};

// Normalize character (apply equivalents)
const normalizeChar = (char: string): string => {
  return equivalentChars[char] || char;
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

  // Check if word starts with the correct letter
  const firstChar = getBaseCharacter(trimmedWord);
  const normalizedFirstChar = normalizeChar(firstChar);
  const normalizedRequired = normalizeChar(teamLetter);

  if (normalizedFirstChar !== normalizedRequired) {
    return { 
      isValid: false, 
      isDuplicate: false, 
      error: `શબ્દ "${teamLetter}" થી શરૂ થવો જોઈએ` 
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

// ✅ ADDED (nothing else changed)
export const getTeamLetter = (team: "A" | "B"): string => {
  return team === "A" ? "A" : "B";
};

// Common Gujarati consonants for letter selection
export const GUJARATI_CONSONANTS = [
  'ક', 'ખ', 'ગ', 'ઘ', 'ચ', 'છ', 'જ', 'ઝ', 'ટ', 'ઠ',
  'ડ', 'ઢ', 'ણ', 'ત', 'થ', 'દ', 'ધ', 'ન', 'પ', 'ફ',
  'બ', 'ભ', 'મ', 'ય', 'ર', 'લ', 'વ', 'શ', 'ષ', 'સ', 'હ', 'ળ'
];
