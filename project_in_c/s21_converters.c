//
// Created by username on 17.09.2025.
//

#include "s21_decimal.h"

int s21_from_int_to_decimal(int src, s21_decimal *dst) {
  int res = 0;
  // long unsigned temp = src;
  if (s21_set_decimal_zero(dst) == 1) res = 1;

  if (res == 0) {
    s21_set_sign(dst, src < 0);

    for (int i = 0; i < (int)(sizeof(src) * 8);
         i++) {
      dst->bits[0] |= s21_read_bit_integer(abs(src), i);
    }
  }
  return res;
}

int s21_from_float_to_decimal(float src, s21_decimal *dst) {
  int res = 0;
  if (s21_set_decimal_zero(dst) == 1) res = 1;

  if (isinf(src) == 1 || isnan(src) == 1) res = 1;
  if (0 < fabs(src) && fabs(src) < 1e-28) res = 1;
  if (fabs(src) >= ldexp(1.0f, 96)) res = 1;

  if (res == 0) {
    int exponent = 0;
    int mantissa = frexpf(src, &exponent);

    s21_set_sign(dst, src < 0);
    s21_from_int_to_decimal(mantissa, dst);

    while (exponent > 28) {
      s21_divide_by_10(dst);
    }
  }
  return res;
}