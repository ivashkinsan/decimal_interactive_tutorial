export const s21_mantissa_compare_code = `#include "s21_decimal.h"

/* Сравнивает значения мантисс чисел value_1 и value_2.
Возвращает 0 - равны, 1 - value_1 больше,
-1 - value_2 больше.
*/

int s21_mantissa_compare(s21_decimal value_1, s21_decimal value_2) {
  int res = 0;
  int skip_flag = 1;
  for (int i = 2; (i >= 0) && skip_flag; i--) {
    if ((unsigned int)value_1.bits[i] > (unsigned int)value_2.bits[i]) {
      res = 1;
      skip_flag = 0;
    }
    if ((unsigned int)value_1.bits[i] < (unsigned int)value_2.bits[i]) {
      res = -1;
      skip_flag = 0;
    }
  }

  return res;
}
`;