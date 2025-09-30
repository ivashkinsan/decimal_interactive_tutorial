#include "s21_decimal.h"

int s21_sub(s21_decimal value_1, s21_decimal value_2, s21_decimal *result) {
  int res = 1;

  if (result != NULL) {
    s21_decimal negated_value_2;
    s21_negate(value_2, &negated_value_2);
    res = s21_add(value_1, negated_value_2, result);
  }

  return res;
}