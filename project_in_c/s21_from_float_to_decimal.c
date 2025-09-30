//
// Created by username on 17.09.2025.
//
#include "s21_decimal.h"

int s21_from_float_to_decimal(float src, s21_decimal *dst) {
  int res = 0;
  s21_set_decimal_zero(dst);

  if (dst == NULL || isinf(src) == 1 || isnan(src) == 1) res = 1;

  if (0 < fabs(src) && fabs(src) < 1e-28) res = 1;

  if (fabs(src) >= ldexp(1.0f, 96)) res = 1;

  if (res == 0) {
    double mantissa = 0;
    int exponent = 0;

    mantissa = fabsf(src);
    while (mantissa >= 10.0) {
      mantissa /= 10;
      exponent++;
    }
    while (mantissa < 1.0 && src != 0) {
      mantissa *= 10;
      exponent--;
    }

    double shifted = mantissa * 1000000;
    int source_integer = floor(shifted);
    double source_fraction = shifted - source_integer;

    if (source_fraction >= 0.5 + DBL_EPSILON) source_integer++;
    if (source_fraction == 0.5) {
      if (source_integer % 2 == 1) source_integer++;
    }

    if (source_integer == 10000000) {
      source_integer /= 10;
      exponent++;
    }
    exponent -= 6;

    s21_decimal temp;
    s21_set_decimal_zero(&temp);

    s21_set_sign(&temp, signbit(src));
    temp.bits[0] = source_integer;
    temp.bits[1] = 0;
    temp.bits[2] = 0;
    if (exponent >= 0) {
      for (int i = 0; i < exponent; ++i) {
        if (s21_multiply_by_10(&temp) != 0) {
          return 1;
        }
      }
    } else {
      int target_scale = -exponent;

      if (target_scale <= 28) {
        s21_set_scale(&temp, target_scale);
      } else {
        int excess = target_scale - 28;
        for (int i = 0; i < excess; ++i) {
          int last = s21_decrease_scale(&temp);
          (void)s21_bank_rounding(&temp, last);
        }
        s21_set_scale(&temp, 28);
      }
    }
    if ((src < 0) && !s21_is_zero(temp)) {
      s21_set_sign(&temp, 1);
    }
    *dst = temp;
  }
  return res;
}
