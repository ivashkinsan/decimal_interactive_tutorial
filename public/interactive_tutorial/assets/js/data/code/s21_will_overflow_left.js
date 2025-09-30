export const s21_will_overflow_left_code = `#include "s21_decimal.h"

/* Проверка на переполнение при сдвиге влево.
Возвращает 0 - успех, 1 - переполнение.
*/

int s21_will_overflow_left(s21_decimal value, int shift) {
  if (shift <= 0) return 0;
  if (shift >= 96) return !s21_is_zero(value);
  int res = 0;

  for (int i = 96 - shift; i < 96; i++) {
    int num = i / 32;
    int bit_num = i % 32;
    int bit_flag = ((unsigned int)value.bits[num] >> bit_num) & 1;

    if (bit_flag == 1) {
      res = 1;
      break;
    }
  }

  return res;
}
`;