#include "s21_decimal.h"

/* Проверяет, является ли число value четным.
Возвращает 1 (Да) и 0 (нет).
*/

int s21_is_even(s21_decimal value) {
  int res = 1;
  if (value.bits[0] & 1) res = 0;
  return res;
}