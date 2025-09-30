#include "s21_decimal.h"

/*Проверяет, что value_1 больше или равно value_2.
1 - Да, больше или равно, 0 - Нет, строго меньше. (Так по заданию).
*/

int s21_is_greater_or_equal(s21_decimal value_1, s21_decimal value_2) {
  return !s21_is_less(value_1, value_2);
}