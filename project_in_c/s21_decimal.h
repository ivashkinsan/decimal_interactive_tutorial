#ifndef S21_DECIMAL_H
#define S21_DECIMAL_H

#include <float.h>
#include <limits.h>
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
  int bits[4];
} s21_decimal;

typedef struct {
  unsigned long long bits[6];  // 192 бита для промежуточных вычислений
  int scale;
  int sign;
} s21_big_decimal;

int s21_get_sign(s21_decimal value);
void s21_set_sign(s21_decimal *value, int sign);
int s21_get_scale(s21_decimal value);
void s21_set_scale(s21_decimal *value, int scale);
int s21_is_zero(s21_decimal value);
int s21_mantissa_compare(s21_decimal value_1, s21_decimal value_2);

int s21_shift_left(s21_decimal *value, int shift);
int s21_shift_right(s21_decimal *value, int shift);
int s21_will_overflow_left(s21_decimal value, int shift);

int s21_will_overflow_add(s21_decimal value_1, s21_decimal value_2);
int s21_add_mantissa(s21_decimal value_1, s21_decimal value_2,
                     s21_decimal *result);
int s21_sub_mantissa(s21_decimal value_1, s21_decimal value_2,
                     s21_decimal *result);
int s21_multiply_by_10(s21_decimal *value);
int s21_divide_by_10(s21_decimal *value);
int s21_normalize(s21_decimal *value_1, s21_decimal *value_2);
int s21_decrease_and_round(s21_decimal *value);

int s21_add_same_sign(s21_decimal value_1, s21_decimal value_2,
                      s21_decimal *result, int sign);
int s21_add_diffrent_sign(s21_decimal value_1, s21_decimal value_2,
                          s21_decimal *result, int sign1, int sign2);
int s21_add_with_rounding(s21_decimal v1, s21_decimal v2, s21_decimal *result,
                          int scale, int sign);
int s21_apply_final_rounding(s21_decimal *result, int balance1, int balance2,
                             int scale);
int s21_reduce_to_scale(s21_decimal *value, int from_scale, int to_scale);
int s21_add_with_rounding(s21_decimal original_v1, s21_decimal original_v2,
                          s21_decimal *result, int original_scale, int sign);

int s21_is_even(s21_decimal value);
int s21_decrease_scale(s21_decimal *value);
// balance = остаток от деления (x % y)
int s21_bank_rounding(s21_decimal *value, int balance);

// сравнения
int s21_is_less(s21_decimal value_1, s21_decimal value_2);
int s21_is_less_or_equal(s21_decimal value_1, s21_decimal value_2);
int s21_is_greater(s21_decimal value_1, s21_decimal value_2);
int s21_is_greater_or_equal(s21_decimal value_1, s21_decimal value_2);
int s21_is_equal(s21_decimal value_1, s21_decimal value_2);
int s21_is_not_equal(s21_decimal value_1, s21_decimal value_2);

// переводы+вспомогательные для переводов
int s21_set_decimal_zero(s21_decimal *value);
int s21_from_int_to_decimal(int src, s21_decimal *dst);
int s21_from_float_to_decimal(float src, s21_decimal *dst);

int s21_read_bit_integer(int src, int bit_number);

// арифметические
int s21_add(s21_decimal value_1, s21_decimal value_2, s21_decimal *result);
int s21_sub(s21_decimal value_1, s21_decimal value_2, s21_decimal *result);

// Другие функции
int s21_negate(s21_decimal value, s21_decimal *result);
int s21_truncate(s21_decimal value, s21_decimal *result);
int s21_round(s21_decimal value, s21_decimal *result);
int s21_floor(s21_decimal value, s21_decimal *result);

// void s21_print(s21_decimal value);

#endif

/*
Как перевести из массива в большое число: value = +/-(bits[2] × 2⁶⁴ + bits[1] ×
2³² + bits[0]) / 10^scale Аналог для 123: +-(1 * 10^2 + 2 * 10^1 + 3) / 10^scale
//Значение: 2⁹⁶ - 1 = 79,228,162,514,264,337,593,543,950,335:
s21_decimal MAX = {{-1, -1, -1, 0}};
//Значение: -(2⁹⁶ - 1) = -79,228,162,514,264,337,593,543,950,335:
s21_decimal MIN = {{-1, -1, -1, -2147483648}};
//Значение: 0
s21_decimal positive_zero = {{0, 0, 0, 0}};
//Значение: -0 (считается эквивалентным +0)
s21_decimal negative_zero = {{0, 0, 0, -2147483648}};
//Значение: 0.0000000000000000000000000000 (28 нулей)
s21_decimal positive_zero_with_max_scale = {{0, 0, 0, 1835008}};
Значение: -0.0000000000000000000000000000 (28 нулей)
s21_decimal negative_with_max_scale = {{0, 0, 0, -2145648640}};
*/
