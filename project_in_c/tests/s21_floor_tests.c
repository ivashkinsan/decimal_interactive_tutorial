#include "s21_tests.h"

START_TEST(test_floor_positive_no_fraction) {
  s21_decimal value = {{123, 0, 0, 0}};  // 123
  s21_decimal result;
  s21_decimal expected = {{123, 0, 0, 0}};

  int status = s21_floor(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_floor_positive_with_fraction) {
  s21_decimal value = {{1239, 0, 0, 0}};
  s21_set_scale(&value, 2);  // 12.39
  s21_decimal result;
  s21_decimal expected = {{12, 0, 0, 0}};  // 12 (12.39 -> 12)

  int status = s21_floor(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_floor_negative_no_fraction) {
  s21_decimal value = {{456, 0, 0, 0}};
  s21_set_sign(&value, 1);  // -456
  s21_decimal result;
  s21_decimal expected = {{456, 0, 0, 0}};
  s21_set_sign(&expected, 1);

  int status = s21_floor(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_floor_negative_with_fraction) {
  s21_decimal value = {{1239, 0, 0, 0}};
  s21_set_scale(&value, 2);  // 12.39
  s21_set_sign(&value, 1);   // -12.39
  s21_decimal result;
  s21_decimal expected = {{13, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -13 (-12.39 -> -13)

  int status = s21_floor(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_floor_positive_small_fraction) {
  s21_decimal value = {{99, 0, 0, 0}};
  s21_set_scale(&value, 2);  // 0.99
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};  // 0

  int status = s21_floor(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_floor_negative_small_fraction) {
  s21_decimal value = {{1, 0, 0, 0}};
  s21_set_scale(&value, 1);  // 0.1
  s21_set_sign(&value, 1);   // -0.1
  s21_decimal result;
  s21_decimal expected = {{1, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -1 (-0.1 -> -1)

  int status = s21_floor(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_floor_zero) {
  s21_decimal value = {{0, 0, 0, 0}};
  s21_set_scale(&value, 3);  // 0.000
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};

  int status = s21_floor(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_floor_null_pointer) {
  s21_decimal value = {{123, 0, 0, 0}};
  s21_set_scale(&value, 1);  // 12.3

  int status = s21_floor(value, NULL);

  ck_assert_int_eq(status, 1);  // Должна вернуть ошибку при NULL указателе
}
END_TEST

Suite *s21_floor_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_floor");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_floor_positive_no_fraction);
  tcase_add_test(tc, test_floor_positive_with_fraction);
  tcase_add_test(tc, test_floor_negative_no_fraction);
  tcase_add_test(tc, test_floor_negative_with_fraction);
  tcase_add_test(tc, test_floor_positive_small_fraction);
  tcase_add_test(tc, test_floor_negative_small_fraction);
  tcase_add_test(tc, test_floor_zero);
  tcase_add_test(tc, test_floor_null_pointer);

  suite_add_tcase(s, tc);
  return s;
}