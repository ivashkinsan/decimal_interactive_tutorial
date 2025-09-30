export const s21_is_equal_code = `#include "s21_decimal.h"

/*Проверяем, равны ли value_1 и value_2.
1 - Равны, 0 - не равны. (Так по заданию).
*/

int s21_is_equal(s21_decimal value_1, s21_decimal value_2) {
  if (s21_is_zero(value_1) && s21_is_zero(value_2)) return 1;
  int res = 0;
  int sign1 = s21_get_sign(value_1);
  int sign2 = s21_get_sign(value_2);

  if (sign1 == sign2) {
    if (s21_normalize(&value_1, &value_2) == 0) {
      if (s21_mantissa_compare(value_1, value_2) == 0) res = 1;
    }
  }

  return res;
}
`;