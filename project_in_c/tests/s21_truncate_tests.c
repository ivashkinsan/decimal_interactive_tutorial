#include "s21_tests.h"

START_TEST(test_truncate_positive_no_fraction) {
  s21_decimal value = {{123, 0, 0, 0}};  // 123
  s21_decimal result;
  s21_decimal expected = {{123, 0, 0, 0}};

  int status = s21_truncate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_truncate_positive_with_fraction) {
  s21_decimal value = {{12345, 0, 0, 0}};
  s21_set_scale(&value, 2);  // 123.45
  s21_decimal result;
  s21_decimal expected = {{123, 0, 0, 0}};  // 123

  int status = s21_truncate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_truncate_negative_no_fraction) {
  s21_decimal value = {{456, 0, 0, 0}};
  s21_set_sign(&value, 1);  // -456
  s21_decimal result;
  s21_decimal expected = {{456, 0, 0, 0}};
  s21_set_sign(&expected, 1);

  int status = s21_truncate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_truncate_negative_with_fraction) {
  s21_decimal value = {{78901, 0, 0, 0}};
  s21_set_scale(&value, 3);  // 78.901
  s21_set_sign(&value, 1);   // -78.901
  s21_decimal result;
  s21_decimal expected = {{78, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -78

  int status = s21_truncate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_truncate_zero) {
  s21_decimal value = {{0, 0, 0, 0}};
  s21_set_scale(&value, 5);  // 0.00000
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};

  int status = s21_truncate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_truncate_small_fraction) {
  s21_decimal value = {{999, 0, 0, 0}};
  s21_set_scale(&value, 3);  // 0.999
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};  // 0

  int status = s21_truncate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_truncate_large_number) {
  // Создаем большое число
  s21_decimal value = {{123456789, 0, 0, 0}};
  s21_set_scale(&value, 3);  // 123456.789
  s21_decimal result;
  s21_decimal expected = {{123456, 0, 0, 0}};  // 123456

  int status = s21_truncate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_scale(result), 0);
}
END_TEST

START_TEST(test_truncate_null_pointer) {
  s21_decimal value = {{123, 0, 0, 0}};

  int status = s21_truncate(value, NULL);

  ck_assert_int_eq(status, 1);  // Должна вернуть ошибку при NULL указателе
}
END_TEST

Suite *s21_truncate_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_truncate");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_truncate_positive_no_fraction);
  tcase_add_test(tc, test_truncate_positive_with_fraction);
  tcase_add_test(tc, test_truncate_negative_no_fraction);
  tcase_add_test(tc, test_truncate_negative_with_fraction);
  tcase_add_test(tc, test_truncate_zero);
  tcase_add_test(tc, test_truncate_small_fraction);
  tcase_add_test(tc, test_truncate_large_number);
  tcase_add_test(tc, test_truncate_null_pointer);

  suite_add_tcase(s, tc);
  return s;
}