#include "s21_decimal.h"

/* Функция округляет s21_decimal value до ближайшего целого числа,
и записывает его в *result.
Возвращает 0 - успех, 1 - ошибка (указатель NULL, либо в вычислениях)
*/

int s21_round(s21_decimal value, s21_decimal *result) {
  if (result == NULL) return 1;
  int scale = s21_get_scale(value);
  if ((scale < 0) || (scale > 28)) return 1;
  int res = 1;
  *result = value;
  int balance = s21_reduce_to_scale(result, scale, 0);
  if (balance < 5) {
    res = 0;
  } else {
    s21_decimal one = {{1, 0, 0, 0}};
    res = s21_add_mantissa(*result, one, result);
  }
  return res;
}