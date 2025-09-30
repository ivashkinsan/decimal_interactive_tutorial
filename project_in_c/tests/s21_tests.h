#ifndef S21_TESTS_H
#define S21_TESTS_H

#include <check.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

#include "../s21_decimal.h"

int run_tests(Suite **suits_set);

void test_s21_is_less(s21_decimal value_1, s21_decimal value_2);
void test_s21_is_less_or_equal(s21_decimal value_1, s21_decimal value_2);
void test_s21_is_greater(s21_decimal value_1, s21_decimal value_2);
void test_s21_is_greater_or_equal(s21_decimal value_1, s21_decimal value_2);
void test_s21_is_equal(s21_decimal value_1, s21_decimal value_2);
void test_s21_is_not_equal(s21_decimal value_1, s21_decimal value_2);
void test_s21_negate(s21_decimal value_1, s21_decimal value_2);
void test_s21_truncate(s21_decimal value_1, s21_decimal value_2);
void test_s21_round(s21_decimal value_1, s21_decimal value_2);
void test_s21_floor(s21_decimal value_1, s21_decimal value_2);
void test_s21_add(s21_decimal value_1, s21_decimal value_2);
void test_s21_sub(s21_decimal value_1, s21_decimal value_2);

Suite *s21_is_less_suite(void);
Suite *s21_is_less_or_equal_suite(void);
Suite *s21_is_greater_suite(void);
Suite *s21_is_greater_or_equal_suite(void);
Suite *s21_is_equal_suite(void);
Suite *s21_is_not_equal_suite(void);
Suite *s21_negate_suite(void);
Suite *s21_truncate_suite(void);
Suite *s21_round_suite(void);
Suite *s21_floor_suite(void);
Suite *s21_add_suite(void);
Suite *s21_sub_suite(void);

#endif