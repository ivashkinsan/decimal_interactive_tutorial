#include "s21_tests.h"

START_TEST(test_round_positive_round_down) {
  s21_decimal value = {{1234, 0, 0, 0}};
  s21_set_scale(&value, 2);  // 12.34
  s21_decimal result;
  s21_decimal expected = {{12, 0, 0, 0}};  // 12 (12.34 -> 12)

  int status = s21_round(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_round_positive_round_up) {
  s21_decimal value = {{1239, 0, 0, 0}};
  s21_set_scale(&value, 2);  // 12.39
  s21_decimal result;
  s21_decimal expected = {{12, 0, 0, 0}};  // 12 (12.39 -> 12)

  int status = s21_round(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_round_positive_half_up) {
  // 12.55 -> balance = 5 (последняя цифра) -> округление вверх
  s21_decimal value = {{1255, 0, 0, 0}};
  s21_set_scale(&value, 2);
  s21_decimal result;
  s21_decimal expected = {{13, 0, 0, 0}};

  int status = s21_round(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_round_negative_round_down) {
  // -12.34 -> последняя цифра 4 -> округление вниз = -12
  s21_decimal value = {{1234, 0, 0, 0}};
  s21_set_scale(&value, 2);
  s21_set_sign(&value, 1);  // -12.34
  s21_decimal result;
  s21_decimal expected = {{12, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -12

  int status = s21_round(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_round_negative_round_up) {
  s21_decimal value = {{1239, 0, 0, 0}};
  s21_set_scale(&value, 2);
  s21_set_sign(&value, 1);  // -12.39
  s21_decimal result;
  s21_decimal expected = {{12, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -12 (-12.39 -> -12)

  int status = s21_round(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_round_negative_half_down) {
  // -12.55 -> последняя цифра 5 -> округление вверх для отрицательных = -13
  s21_decimal value = {{1255, 0, 0, 0}};
  s21_set_scale(&value, 2);
  s21_set_sign(&value, 1);  // -12.55
  s21_decimal result;
  s21_decimal expected = {{13, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -13

  int status = s21_round(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_round_zero) {
  s21_decimal value = {{5, 0, 0, 0}};
  s21_set_scale(&value, 1);  // 0.5
  s21_decimal result;
  s21_decimal expected = {{1, 0, 0, 0}};  // 1 (0.5 -> 1)

  int status = s21_round(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_round_null_pointer) {
  s21_decimal value = {{123, 0, 0, 0}};
  s21_set_scale(&value, 1);  // 12.3

  int status = s21_round(value, NULL);

  ck_assert_int_eq(status, 1);  // Должна вернуть ошибку при NULL указателе
}
END_TEST

Suite *s21_round_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_round");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_round_positive_round_down);
  tcase_add_test(tc, test_round_positive_round_up);
  tcase_add_test(tc, test_round_positive_half_up);
  tcase_add_test(tc, test_round_negative_round_down);
  tcase_add_test(tc, test_round_negative_round_up);
  tcase_add_test(tc, test_round_negative_half_down);
  tcase_add_test(tc, test_round_zero);
  tcase_add_test(tc, test_round_null_pointer);

  suite_add_tcase(s, tc);
  return s;
}