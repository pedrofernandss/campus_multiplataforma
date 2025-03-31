export const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase(); 
      })
      .join(' ');
  };
  