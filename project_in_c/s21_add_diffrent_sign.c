#include "s21_decimal.h"

/*Функция выполняет сложение двух чисел s21_decimal с разными знаками
sign1 и sign2 в *result.
0 - Успех, 1 - ошибка (указатель NULL или число нельзя нормализовать),

*/

int s21_add_diffrent_sign(s21_decimal value_1, s21_decimal value_2,
                          s21_decimal *result, int sign1, int sign2) {
  if (result == NULL) return 1;

  int res = 1;
  int scale = 0;

  if (s21_normalize(&value_1, &value_2) == 0) {
    res = 0;
    scale = s21_get_scale(value_1);

    int compare = s21_mantissa_compare(value_1, value_2);

    if (compare == 1) {
      res = s21_sub_mantissa(value_1, value_2, result);
      s21_set_sign(result, sign1);
    } else if (compare == -1) {
      res = s21_sub_mantissa(value_2, value_1, result);
      s21_set_sign(result, sign2);
    } else {
      *result = (s21_decimal){{0, 0, 0, 0}};
    }

    if (res == 0) {
      s21_set_scale(result, scale);
    }
  }

  return res;
}