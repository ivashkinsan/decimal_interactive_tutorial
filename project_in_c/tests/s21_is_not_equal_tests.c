#include "s21_tests.h"

START_TEST(test_neq_basic_positive) {
  s21_decimal five1 = {{5, 0, 0, 0}};
  s21_decimal five2 = {{5, 0, 0, 0}};
  s21_decimal six = {{6, 0, 0, 0}};

  // 5 != 5 -> FALSE (0)
  ck_assert_int_eq(s21_is_not_equal(five1, five2), 0);
  // 5 != 6 -> TRUE (1)
  ck_assert_int_eq(s21_is_not_equal(five1, six), 1);
}
END_TEST

START_TEST(test_neq_basic_negative) {
  s21_decimal neg_five1 = {{5, 0, 0, 0}};
  s21_decimal neg_five2 = {{5, 0, 0, 0}};
  s21_decimal neg_six = {{6, 0, 0, 0}};
  s21_set_sign(&neg_five1, 1);
  s21_set_sign(&neg_five2, 1);
  s21_set_sign(&neg_six, 1);

  // -5 != -5 -> FALSE (0)
  ck_assert_int_eq(s21_is_not_equal(neg_five1, neg_five2), 0);
  // -5 != -6 -> TRUE (1)
  ck_assert_int_eq(s21_is_not_equal(neg_five1, neg_six), 1);
}
END_TEST

START_TEST(test_neq_zero_cases) {
  s21_decimal zero_pos = {0};
  s21_decimal zero_neg = {0};
  s21_decimal one = {{1, 0, 0, 0}};
  s21_set_sign(&zero_neg, 1);

  // 0 != -0 -> FALSE (0) - нули считаются равными
  ck_assert_int_eq(s21_is_not_equal(zero_pos, zero_neg), 0);
  // 0 != 1 -> TRUE (1)
  ck_assert_int_eq(s21_is_not_equal(zero_pos, one), 1);
  // -0 != 1 -> TRUE (1)
  ck_assert_int_eq(s21_is_not_equal(zero_neg, one), 1);
}
END_TEST

START_TEST(test_neq_different_scale) {
  s21_decimal num1 = {{10, 0, 0, 0}};          // 10
  s21_decimal num2 = {{100, 0, 0, 0}};         // 100
  s21_decimal num1_scale1 = {{10, 0, 0, 0}};   // 1.0
  s21_decimal num2_scale2 = {{100, 0, 0, 0}};  // 1.00
  s21_set_scale(&num1_scale1, 1);
  s21_set_scale(&num2_scale2, 2);

  // 10 != 100 -> TRUE (1)
  ck_assert_int_eq(s21_is_not_equal(num1, num2), 1);
  // 1.0 != 1.00 -> FALSE (0) - после нормализации равны
  ck_assert_int_eq(s21_is_not_equal(num1_scale1, num2_scale2), 0);
}
END_TEST

START_TEST(test_neq_large_numbers) {
  // Создаем два больших одинаковых числа
  s21_decimal large1 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_decimal large2 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX

  // Создаем число на 1 меньше (в младшем разряде)
  s21_decimal large_minus_one = {{0xFFFFFFFE, 0xFFFFFFFF, 0xFFFFFFFF, 0}};

  // MAX != MAX -> FALSE (0)
  ck_assert_int_eq(s21_is_not_equal(large1, large2), 0);
  // MAX != (MAX-1) -> TRUE (1)
  ck_assert_int_eq(s21_is_not_equal(large1, large_minus_one), 1);
}
END_TEST

START_TEST(test_neq_negative_with_scale) {
  s21_decimal neg_num1 = {{100, 0, 0, 0}};   // -100
  s21_decimal neg_num2 = {{1000, 0, 0, 0}};  // -1000
  s21_set_sign(&neg_num1, 1);
  s21_set_sign(&neg_num2, 1);
  s21_set_scale(&neg_num2, 1);  // -100.0

  // -100 != -100.0 -> FALSE (0) - после нормализации равны
  ck_assert_int_eq(s21_is_not_equal(neg_num1, neg_num2), 0);
}
END_TEST

Suite *s21_is_not_equal_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_is_not_equal");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_neq_basic_positive);
  tcase_add_test(tc, test_neq_basic_negative);
  tcase_add_test(tc, test_neq_zero_cases);
  tcase_add_test(tc, test_neq_different_scale);
  tcase_add_test(tc, test_neq_large_numbers);
  tcase_add_test(tc, test_neq_negative_with_scale);

  suite_add_tcase(s, tc);
  return s;
}
