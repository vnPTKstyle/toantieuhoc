/** So khớp đáp án trắc nghiệm (bỏ khoảng trắng, không phân biệt hoa/thường tiếng Việt). */
function sameAnswer(user, correct) {
  if (user == null || correct == null) return false;
  const a = String(user).trim().normalize('NFC');
  const b = String(correct).trim().normalize('NFC');
  if (a === b) return true;
  try {
    return a.localeCompare(b, 'vi', { sensitivity: 'base' }) === 0;
  } catch {
    return a.toLowerCase() === b.toLowerCase();
  }
}

module.exports = { sameAnswer };
