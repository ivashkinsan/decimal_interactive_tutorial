export const s21_get_sign_code = `#include "s21_decimal.h"

/* Извлекает знак (1 - минус, 0 - плюс) из 31-го байта числа value.bits[3].
Возварщает это значение.
*/

int s21_get_sign(s21_decimal value) {
  int sign = (value.bits[3] >> 31) & 1;
  return sign;
}
`;