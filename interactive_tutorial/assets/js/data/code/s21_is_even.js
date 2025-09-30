export const s21_is_even_code = `#include "s21_decimal.h"

/* Проверяет, является ли число value четным.
Возвращает 0 (Да) и 1 (нет).
*/

int s21_is_even(s21_decimal value) {
  int res = 0;
  if (value.bits[0] & 1) res = 1;
  return res;
}
`;