//
// Created by username on 17.09.2025.
//
#include "s21_decimal.h"

int s21_set_decimal_zero(s21_decimal *value) {
  int res = 0;
  if (value == NULL) res = 1;

  if (res == 0) {
    s21_set_scale(value, 0);
    for (long unsigned int i = 0;
         i < sizeof(value->bits) / sizeof(value->bits[0]); i++) {
      value->bits[i] = 0;
    }
  }

  return res;
}