#include "s21_decimal.h"

/*Проверяем, что value_1 и value_2 НЕ равны.
1 - НЕ равны, 0 - равны. (Так по заданию).
*/

int s21_is_not_equal(s21_decimal value_1, s21_decimal value_2) {
  return !s21_is_equal(value_1, value_2);
}