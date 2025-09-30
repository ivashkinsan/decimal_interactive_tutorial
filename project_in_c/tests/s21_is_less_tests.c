#include "s21_tests.h"

START_TEST(test_less_basic_positive) {
  s21_decimal five = {{5, 0, 0, 0}};
  s21_decimal six = {{6, 0, 0, 0}};

  // 5 < 6 -> TRUE (1)
  ck_assert_int_eq(s21_is_less(five, six), 1);
  // 6 < 5 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(six, five), 0);
  // 5 < 5 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(five, five), 0);
}
END_TEST

START_TEST(test_less_basic_negative) {
  s21_decimal neg_five = {{5, 0, 0, 0}};
  s21_decimal neg_six = {{6, 0, 0, 0}};
  s21_set_sign(&neg_five, 1);
  s21_set_sign(&neg_six, 1);

  // -6 < -5 -> TRUE (1) (т.к. -6 более отрицательное)
  ck_assert_int_eq(s21_is_less(neg_six, neg_five), 1);
  // -5 < -6 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(neg_five, neg_six), 0);
  // -5 < -5 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(neg_five, neg_five), 0);
}
END_TEST

START_TEST(test_less_mixed_sign) {
  s21_decimal neg_five = {{5, 0, 0, 0}};
  s21_decimal five = {{5, 0, 0, 0}};
  s21_set_sign(&neg_five, 1);

  // -5 < 5 -> TRUE (1)
  ck_assert_int_eq(s21_is_less(neg_five, five), 1);
  // 5 < -5 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(five, neg_five), 0);
}
END_TEST

START_TEST(test_less_zero_cases) {
  s21_decimal zero = {0};
  s21_decimal neg_zero = {0};
  s21_decimal one = {{1, 0, 0, 0}};
  s21_decimal neg_one = {{1, 0, 0, 0}};
  s21_set_sign(&neg_zero, 1);
  s21_set_sign(&neg_one, 1);

  // 0 < 0 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(zero, zero), 0);
  // -0 < 0 -> FALSE (0) (нули равны)
  ck_assert_int_eq(s21_is_less(neg_zero, zero), 0);
  // 0 < -0 -> FALSE (0) (нули равны)
  ck_assert_int_eq(s21_is_less(zero, neg_zero), 0);
  // 0 < 1 -> TRUE (1)
  ck_assert_int_eq(s21_is_less(zero, one), 1);
  // -1 < 0 -> TRUE (1)
  ck_assert_int_eq(s21_is_less(neg_one, zero), 1);
}
END_TEST

START_TEST(test_less_different_scale) {
  s21_decimal num1 = {{100, 0, 0, 0}};          // 100
  s21_decimal num2 = {{1000, 0, 0, 0}};         // 1000
  s21_decimal num1_scale1 = {{100, 0, 0, 0}};   // 10.0
  s21_decimal num2_scale1 = {{1000, 0, 0, 0}};  // 100.0
  s21_set_scale(&num1_scale1, 1);
  s21_set_scale(&num2_scale1, 1);

  // 100 < 1000 -> TRUE (1)
  ck_assert_int_eq(s21_is_less(num1, num2), 1);
  // 10.0 < 100.0 -> TRUE (1)
  ck_assert_int_eq(s21_is_less(num1_scale1, num2_scale1), 1);
  // 100.0 < 10.0 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(num2_scale1, num1_scale1), 0);
}
END_TEST

START_TEST(test_less_fractional_comparison) {
  s21_decimal one = {{1, 0, 0, 0}};          // 1
  s21_decimal point_nine = {{9, 0, 0, 0}};   // 0.9
  s21_decimal point_nine2 = {{9, 0, 0, 0}};  // 0.90
  s21_set_scale(&point_nine, 1);
  s21_set_scale(&point_nine2, 2);

  // 0.9 < 1 -> TRUE (1)
  ck_assert_int_eq(s21_is_less(point_nine, one), 1);
  // 1 < 0.9 -> FALSE (0)
  ck_assert_int_eq(s21_is_less(one, point_nine), 0);
  // 0.9 < 0.90 -> FALSE (0) (равны после нормализации)
  ck_assert_int_eq(s21_is_less(point_nine, point_nine2), 0);
}
END_TEST

START_TEST(test_less_large_numbers) {
  s21_decimal max_val = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};     // MAX
  s21_decimal almost_max = {{0xFFFFFFFE, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX-1

  // (MAX-1) < MAX -> TRUE (1)
  ck_assert_int_eq(s21_is_less(almost_max, max_val), 1);
  // MAX < (MAX-1) -> FALSE (0)
  ck_assert_int_eq(s21_is_less(max_val, almost_max), 0);
  // MAX < MAX -> FALSE (0)
  ck_assert_int_eq(s21_is_less(max_val, max_val), 0);
}
END_TEST

START_TEST(test_less_negative_with_scale) {
  s21_decimal neg_hundred = {{100, 0, 0, 0}};         // -100
  s21_decimal neg_hundred_point = {{1000, 0, 0, 0}};  // -100.0
  s21_set_sign(&neg_hundred, 1);
  s21_set_sign(&neg_hundred_point, 1);
  s21_set_scale(&neg_hundred_point, 1);

  // -100 < -100.0 -> FALSE (0) (равны после нормализации)
  ck_assert_int_eq(s21_is_less(neg_hundred, neg_hundred_point), 0);
  // -100.0 < -100 -> FALSE (0) (равны после нормализации)
  ck_assert_int_eq(s21_is_less(neg_hundred_point, neg_hundred), 0);
}
END_TEST

Suite *s21_is_less_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_is_less");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_less_basic_positive);
  tcase_add_test(tc, test_less_basic_negative);
  tcase_add_test(tc, test_less_mixed_sign);
  tcase_add_test(tc, test_less_zero_cases);
  tcase_add_test(tc, test_less_different_scale);
  tcase_add_test(tc, test_less_fractional_comparison);
  tcase_add_test(tc, test_less_large_numbers);
  tcase_add_test(tc, test_less_negative_with_scale);

  suite_add_tcase(s, tc);
  return s;
}
