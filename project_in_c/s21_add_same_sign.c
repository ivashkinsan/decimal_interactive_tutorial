#include "s21_decimal.h"

/*Функция выполняет сложение двух чисел s21_decimal с одинаковым знаком sign в
*result. 0 - Успех, 1 - ошибка (указатель NULL или слишком большое число), 2 -
ошибка (слишком маленькое число)
*/

int s21_add_same_sign(s21_decimal value_1, s21_decimal value_2,
                      s21_decimal *result, int sign) {
  if (result == NULL) return 1;

  int res = 0;
  int scale = 0;

  s21_normalize(&value_1, &value_2);
  scale = s21_get_scale(value_1);
  res = s21_add_with_rounding(value_1, value_2, result, scale, sign);

  return res;
}