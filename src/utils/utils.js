export const validateResponseCode = (code) => {
  return Math.floor(code / 100) === 2;
};

export const textSlicer = (text, length) => {
  if (!text) return "";
  if(length<0)return text;
  if (text.length > length) {
    text = text.slice(0, length) + " ...";
  }
  return text;
};

