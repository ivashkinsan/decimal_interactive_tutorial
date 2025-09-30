#include "s21_tests.h"

START_TEST(test_greater_or_equal_basic_positive) {
  s21_decimal five = {{5, 0, 0, 0}};
  s21_decimal six = {{6, 0, 0, 0}};

  // 5 >= 6 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(five, six), 0);
  // 6 >= 5 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(six, five), 1);
  // 5 >= 5 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(five, five), 1);
}
END_TEST

START_TEST(test_greater_or_equal_basic_negative) {
  s21_decimal neg_five = {{5, 0, 0, 0}};
  s21_decimal neg_six = {{6, 0, 0, 0}};
  s21_set_sign(&neg_five, 1);
  s21_set_sign(&neg_six, 1);

  // -6 >= -5 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(neg_six, neg_five), 0);
  // -5 >= -6 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(neg_five, neg_six), 1);
  // -5 >= -5 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(neg_five, neg_five), 1);
}
END_TEST

START_TEST(test_greater_or_equal_mixed_sign) {
  s21_decimal neg_five = {{5, 0, 0, 0}};
  s21_decimal five = {{5, 0, 0, 0}};
  s21_set_sign(&neg_five, 1);

  // -5 >= 5 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(neg_five, five), 0);
  // 5 >= -5 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(five, neg_five), 1);
}
END_TEST

START_TEST(test_greater_or_equal_zero_cases) {
  s21_decimal zero = {0};
  s21_decimal neg_zero = {0};
  s21_decimal one = {{1, 0, 0, 0}};
  s21_decimal neg_one = {{1, 0, 0, 0}};
  s21_set_sign(&neg_zero, 1);
  s21_set_sign(&neg_one, 1);

  // 0 >= 0 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(zero, zero), 1);
  // -0 >= 0 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(neg_zero, zero), 1);
  // 0 >= -0 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(zero, neg_zero), 1);
  // 0 >= 1 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(zero, one), 0);
  // -1 >= 0 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(neg_one, zero), 0);
}
END_TEST

START_TEST(test_greater_or_equal_different_scale) {
  s21_decimal num1 = {{100, 0, 0, 0}};
  s21_decimal num2 = {{1000, 0, 0, 0}};
  s21_decimal num1_scale1 = {{100, 0, 0, 0}};
  s21_decimal num2_scale1 = {{1000, 0, 0, 0}};
  s21_set_scale(&num1_scale1, 1);
  s21_set_scale(&num2_scale1, 1);

  // 100 >= 1000 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(num1, num2), 0);
  // 10.0 >= 100.0 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(num1_scale1, num2_scale1), 0);
  // 100.0 >= 10.0 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(num2_scale1, num1_scale1), 1);
}
END_TEST

START_TEST(test_greater_or_equal_fractional_comparison) {
  s21_decimal one = {{1, 0, 0, 0}};
  s21_decimal point_nine = {{9, 0, 0, 0}};
  s21_set_scale(&point_nine, 1);

  // 0.9 >= 1 -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(point_nine, one), 0);
  // 1 >= 0.9 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(one, point_nine), 1);
  // 0.9 >= 0.9 -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(point_nine, point_nine), 1);
}
END_TEST

START_TEST(test_greater_or_equal_large_numbers) {
  s21_decimal max_val = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};
  s21_decimal almost_max = {{0xFFFFFFFE, 0xFFFFFFFF, 0xFFFFFFFF, 0}};

  // (MAX-1) >= MAX -> FALSE (0)
  ck_assert_int_eq(s21_is_greater_or_equal(almost_max, max_val), 0);
  // MAX >= (MAX-1) -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(max_val, almost_max), 1);
  // MAX >= MAX -> TRUE (1)
  ck_assert_int_eq(s21_is_greater_or_equal(max_val, max_val), 1);
}
END_TEST

Suite *s21_is_greater_or_equal_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_is_greater_or_equal");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_greater_or_equal_basic_positive);
  tcase_add_test(tc, test_greater_or_equal_basic_negative);
  tcase_add_test(tc, test_greater_or_equal_mixed_sign);
  tcase_add_test(tc, test_greater_or_equal_zero_cases);
  tcase_add_test(tc, test_greater_or_equal_different_scale);
  tcase_add_test(tc, test_greater_or_equal_fractional_comparison);
  tcase_add_test(tc, test_greater_or_equal_large_numbers);

  suite_add_tcase(s, tc);
  return s;
}