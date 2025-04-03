export const capitalizeWords = (str) => {
  if (!str) return str; 

  return str
    .split(/\s+/) 
    .map(word => {
      if (word) {
        return word[0].toUpperCase() + word.substring(1).toLowerCase(); 
      }
      return ''; 
    })
    .join(' '); 
};
