/** Dữ liệu dùng chung — tách để tránh require vòng trong slides */
const ALPHABET = 'aăâbcdđeêghiklmnopqrstuưvy'.split('');
const CONSONANTS = ['b', 'c', 'd', 'đ', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x'];
const VOWELS = ['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y'];

const VAN_GROUPS = [
  {
    id: 'van-a',
    center: 'a',
    items: [
      { c: 'b', word: 'ba', sentence: 'Ba đi làm.' },
      { c: 'm', word: 'ma', sentence: 'Mẹ ru con ngủ.' },
      { c: 'c', word: 'ca', sentence: 'Ca hát vui.' },
      { c: 'l', word: 'la', sentence: 'Lá cây xanh.' },
    ],
  },
  {
    id: 'van-an',
    center: 'an',
    items: [
      { c: 'b', word: 'ban', sentence: 'Ban ngày em học.' },
      { c: 'c', word: 'can', sentence: 'Can cẩn khi viết.' },
      { c: 'h', word: 'han', sentence: 'Hạn chế ồn ào.' },
      { c: 'l', word: 'lan', sentence: 'Hoa lan đẹp.' },
    ],
  },
  {
    id: 'van-at',
    center: 'at',
    items: [
      { c: 'b', word: 'bat', sentence: 'Bát cơm nóng.' },
      { c: 'c', word: 'cat', sentence: 'Cát vàng.' },
      { c: 'm', word: 'mat', sentence: 'Mắt sáng.' },
      { c: 'v', word: 'vat', sentence: 'Vật dùng học.' },
    ],
  },
  {
    id: 'van-on',
    center: 'on',
    items: [
      { c: 'c', word: 'con', sentence: 'Con yêu mẹ.' },
      { c: 'm', word: 'mon', sentence: 'Món ăn ngon.' },
      { c: 'h', word: 'hon', sentence: 'Hon đi chơi.' },
      { c: 'b', word: 'bon', sentence: 'Bon bon vui.' },
    ],
  },
  {
    id: 'van-en',
    center: 'en',
    items: [
      { c: 'b', word: 'ben', sentence: 'Ben xe đạp.' },
      { c: 'l', word: 'len', sentence: 'Len ấm.' },
      { c: 's', word: 'sen', sentence: 'Sen nở.' },
      { c: 'v', word: 'ven', sentence: 'Ven sông xanh.' },
    ],
  },
  {
    id: 'van-ung',
    center: 'ung',
    items: [
      { c: 'b', word: 'bung', sentence: 'Bụng no.' },
      { c: 'c', word: 'cung', sentence: 'Cung vui.' },
      { c: 'h', word: 'hung', sentence: 'Hưng vui.' },
      { c: 's', word: 'sung', sentence: 'Sung sướng.' },
    ],
  },
];

const LUYEN_DOC = [
  {
    title: 'Đồng dao — Chú voi con',
    lines: ['Chú voi con đi học', 'Đi sớm về muộn', 'Học chữ, học làm', 'Mẹ vui lòng lắm.'],
  },
  {
    title: 'Ca dao — Cây và gió',
    lines: ['Cây xanh lá rung rinh', 'Gió nhẹ đưa cành', 'Em nghe tiếng lá', 'Như lời mẹ ru.'],
  },
  {
    title: 'Câu quen thuộc',
    lines: ['Em đi học.', 'Mẹ yêu em.', 'Trường em vui.', 'Bạn em thân.'],
  },
];

module.exports = { ALPHABET, CONSONANTS, VOWELS, VAN_GROUPS, LUYEN_DOC };
