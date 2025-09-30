export const s21_is_less_code = `#include "s21_decimal.h"

/*Проверяет, строго ли value_1 меньше, чем value_2.
1 - Да, строго меньше, 0 - Нет, больше или равны. (Так по заданию).
*/

int s21_is_less(s21_decimal value_1, s21_decimal value_2) {
  if (s21_is_zero(value_1) && s21_is_zero(value_2)) return 0;
  int res = 0;
  int sign1 = s21_get_sign(value_1);
  int sign2 = s21_get_sign(value_2);

  if (sign1 == 1 && sign2 == 0) res = 1;

  if (sign1 == sign2 && sign1 == 0) {
    if (s21_normalize(&value_1, &value_2) == 0) {
      if (s21_mantissa_compare(value_1, value_2) == -1) res = 1;
    }
  }
  if (sign1 == sign2 && sign1 == 1) {
    if (s21_normalize(&value_1, &value_2) == 0) {
      if (s21_mantissa_compare(value_1, value_2) == 1) res = 1;
    }
  }

  return res;
}
`;