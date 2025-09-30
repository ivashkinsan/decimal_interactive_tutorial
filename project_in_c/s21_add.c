#include "s21_decimal.h"

/*Функция выполняет сложение двух чисел s21_decimal в *result.
0 - Успех, 1 - ошибка (указатель NULL или слишком большое число),
2 - ошибка (слишком маленькое число)
*/

int s21_add(s21_decimal value_1, s21_decimal value_2, s21_decimal *result) {
  if (result == NULL) return 1;
  if (s21_is_zero(value_1)) {
    *result = value_2;
    return 0;
  }
  if (s21_is_zero(value_2)) {
    *result = value_1;
    return 0;
  }
  int res = 1;
  int sign1 = s21_get_sign(value_1);
  int sign2 = s21_get_sign(value_2);

  if (sign1 == sign2) res = s21_add_same_sign(value_1, value_2, result, sign1);
  if (sign1 != sign2)
    res = s21_add_diffrent_sign(value_1, value_2, result, sign1, sign2);

  return res;
}