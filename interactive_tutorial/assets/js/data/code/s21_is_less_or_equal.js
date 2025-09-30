export const s21_is_less_or_equal_code = `#include "s21_decimal.h"

/*Проверяет, что value_1 меньше или равно value_2.
1 - Да, меньше или равно, 0 - Нет, строго больше. (Так по заданию).
*/

int s21_is_less_or_equal(s21_decimal value_1, s21_decimal value_2) {
  return !s21_is_greater(value_1, value_2);
}
`;