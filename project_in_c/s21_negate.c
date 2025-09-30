#include "s21_decimal.h"

/* Изменяет знак числа value на противоположный и записывает результат в result.
Возвращает 0 - Успех, 1 - ошибка (указатель NULL).
*/

int s21_negate(s21_decimal value, s21_decimal *result) {
  if (result == NULL) return 1;
  *result = value;
  int sign = s21_get_sign(value);
  s21_set_sign(result, !sign);
  return 0;
}