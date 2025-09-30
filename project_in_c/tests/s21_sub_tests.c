#include "s21_tests.h"

START_TEST(test_sub_positive_simple) {
  s21_decimal value1 = {{8, 0, 0, 0}};  // 8
  s21_decimal value2 = {{3, 0, 0, 0}};  // 3
  s21_decimal result;
  s21_decimal expected = {{5, 0, 0, 0}};  // 5

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_negative_simple) {
  s21_decimal value1 = {{8, 0, 0, 0}};
  s21_decimal value2 = {{3, 0, 0, 0}};
  s21_set_sign(&value1, 1);  // -8
  s21_set_sign(&value2, 1);  // -3
  s21_decimal result;
  s21_decimal expected = {{5, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -5 (-8 - (-3) = -5)

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_positive_minus_negative) {
  s21_decimal value1 = {{10, 0, 0, 0}};  // 10
  s21_decimal value2 = {{3, 0, 0, 0}};
  s21_set_sign(&value2, 1);  // -3
  s21_decimal result;
  s21_decimal expected = {{13, 0, 0, 0}};  // 13 (10 - (-3) = 13)

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_negative_minus_positive) {
  s21_decimal value1 = {{10, 0, 0, 0}};
  s21_set_sign(&value1, 1);             // -10
  s21_decimal value2 = {{3, 0, 0, 0}};  // 3
  s21_decimal result;
  s21_decimal expected = {{13, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -13 (-10 - 3 = -13)

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_zero_cases) {
  s21_decimal zero = {{0, 0, 0, 0}};
  s21_decimal five = {{5, 0, 0, 0}};
  s21_decimal result;

  // 5 - 0 = 5
  int status1 = s21_sub(five, zero, &result);
  ck_assert_int_eq(status1, 0);
  ck_assert_int_eq(s21_is_equal(result, five), 1);

  // 0 - 5 = -5
  int status2 = s21_sub(zero, five, &result);
  s21_decimal neg_five = {{5, 0, 0, 0}};
  s21_set_sign(&neg_five, 1);
  ck_assert_int_eq(status2, 0);
  ck_assert_int_eq(s21_is_equal(result, neg_five), 1);

  // 0 - 0 = 0
  int status3 = s21_sub(zero, zero, &result);
  ck_assert_int_eq(status3, 0);
  ck_assert_int_eq(s21_is_equal(result, zero), 1);
}
END_TEST

START_TEST(test_sub_with_different_scales) {
  s21_decimal value1 = {{579, 0, 0, 0}};  // 5.79
  s21_decimal value2 = {{456, 0, 0, 0}};  // 4.56
  s21_set_scale(&value1, 2);
  s21_set_scale(&value2, 2);
  s21_decimal result;
  s21_decimal expected = {{123, 0, 0, 0}};  // 1.23
  s21_set_scale(&expected, 2);

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_very_different_scales) {
  s21_decimal value1 = {{123456, 0, 0, 0}};  // 123.456
  s21_decimal value2 = {{456, 0, 0, 0}};     // 0.456
  s21_set_scale(&value1, 3);
  s21_set_scale(&value2, 3);
  s21_decimal result;
  s21_decimal expected = {{123000, 0, 0, 0}};  // 123.000
  s21_set_scale(&expected, 3);

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_negative_with_scales) {
  s21_decimal value1 = {{150, 0, 0, 0}};  // -1.50
  s21_decimal value2 = {{50, 0, 0, 0}};   // -0.50
  s21_set_sign(&value1, 1);
  s21_set_sign(&value2, 1);
  s21_set_scale(&value1, 2);
  s21_set_scale(&value2, 2);
  s21_decimal result;
  s21_decimal expected = {{100, 0, 0, 0}};  // -1.00
  s21_set_sign(&expected, 1);
  s21_set_scale(&expected, 2);

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_mixed_signs_with_scales) {
  s21_decimal value1 = {{150, 0, 0, 0}};  // 1.50
  s21_decimal value2 = {{75, 0, 0, 0}};   // -0.75
  s21_set_sign(&value2, 1);
  s21_set_scale(&value1, 2);
  s21_set_scale(&value2, 2);
  s21_decimal result;
  s21_decimal expected = {{225, 0, 0, 0}};  // 2.25
  s21_set_scale(&expected, 2);

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_large_numbers) {
  s21_decimal value1 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_decimal value2 = {{0x0000000F, 0, 0, 0}};                    // 15
  s21_decimal result;
  s21_decimal expected = {{0xFFFFFFF0, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX - 15

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_underflow_negative) {
  s21_decimal value1 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};
  s21_set_sign(&value1, 1);             // -MAX
  s21_decimal value2 = {{1, 0, 0, 0}};  // 1
  s21_decimal result;

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status,
                   2);  // Должна вернуть ошибку отрицательного переполнения
}
END_TEST

START_TEST(test_sub_underflow_positive) {
  s21_decimal value1 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_decimal value2 = {{1, 0, 0, 0}};
  s21_set_sign(&value2, 1);  // -1
  s21_decimal result;

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status,
                   1);  // Должна вернуть ошибку положительного переполнения
}
END_TEST

START_TEST(test_sub_negative_zero_result) {
  s21_decimal value1 = {{5, 0, 0, 0}};
  s21_set_sign(&value1, 1);  // -5
  s21_decimal value2 = {{5, 0, 0, 0}};
  s21_set_sign(&value2, 1);  // -5
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};  // 0

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_positive_zero_result) {
  s21_decimal value1 = {{5, 0, 0, 0}};  // 5
  s21_decimal value2 = {{5, 0, 0, 0}};  // 5
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};  // 0

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_sub_null_pointer) {
  s21_decimal value1 = {{5, 0, 0, 0}};
  s21_decimal value2 = {{3, 0, 0, 0}};

  int status = s21_sub(value1, value2, NULL);

  ck_assert_int_eq(status, 1);  // Должна вернуть ошибку при NULL указателе
}
END_TEST

START_TEST(test_sub_max_scale_normalization) {
  s21_decimal value1 = {{2, 0, 0, 0}};  // 0.0000000000000000000000000002
  s21_decimal value2 = {{1, 0, 0, 0}};  // 0.0000000000000000000000000001
  s21_set_scale(&value1, 28);
  s21_set_scale(&value2, 28);
  s21_decimal result;
  s21_decimal expected = {{1, 0, 0, 0}};  // 0.0000000000000000000000000001
  s21_set_scale(&expected, 28);

  int status = s21_sub(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

Suite *s21_sub_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_sub");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_sub_positive_simple);
  tcase_add_test(tc, test_sub_negative_simple);
  tcase_add_test(tc, test_sub_positive_minus_negative);
  tcase_add_test(tc, test_sub_negative_minus_positive);
  tcase_add_test(tc, test_sub_zero_cases);
  tcase_add_test(tc, test_sub_with_different_scales);
  tcase_add_test(tc, test_sub_very_different_scales);
  tcase_add_test(tc, test_sub_negative_with_scales);
  tcase_add_test(tc, test_sub_mixed_signs_with_scales);
  tcase_add_test(tc, test_sub_large_numbers);
  tcase_add_test(tc, test_sub_underflow_negative);
  tcase_add_test(tc, test_sub_underflow_positive);
  tcase_add_test(tc, test_sub_negative_zero_result);
  tcase_add_test(tc, test_sub_positive_zero_result);
  tcase_add_test(tc, test_sub_null_pointer);
  tcase_add_test(tc, test_sub_max_scale_normalization);

  suite_add_tcase(s, tc);
  return s;
}