#include "s21_tests.h"

START_TEST(test_negate_basic_positive) {
  s21_decimal value = {{5, 0, 0, 0}};  // +5
  s21_decimal result;
  s21_decimal expected = {{5, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -5

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);  // Успешное выполнение
  ck_assert_int_eq(s21_is_equal(result, expected),
                   1);  // Результат должен быть -5
  ck_assert_int_eq(s21_get_sign(result), 1);  // Знак отрицательный
}
END_TEST

START_TEST(test_negate_basic_negative) {
  s21_decimal value = {{5, 0, 0, 0}};
  s21_set_sign(&value, 1);  // -5
  s21_decimal result;
  s21_decimal expected = {{5, 0, 0, 0}};  // +5

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected),
                   1);  // Результат должен быть +5
  ck_assert_int_eq(s21_get_sign(result), 0);  // Знак положительный
}
END_TEST

START_TEST(test_negate_zero_positive) {
  s21_decimal value = {{0, 0, 0, 0}};  // +0
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -0

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);  // +0 -> -0
  ck_assert_int_eq(s21_get_sign(result), 1);
}
END_TEST

START_TEST(test_negate_zero_negative) {
  s21_decimal value = {{0, 0, 0, 0}};
  s21_set_sign(&value, 1);  // -0
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};  // +0

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);  // -0 -> +0
  ck_assert_int_eq(s21_get_sign(result), 0);
}
END_TEST

START_TEST(test_negate_large_number_positive) {
  s21_decimal value = {
      {0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX positive
  s21_decimal result;
  s21_decimal expected = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};
  s21_set_sign(&expected, 1);  // MAX negative

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_sign(result), 1);
}
END_TEST

START_TEST(test_negate_large_number_negative) {
  s21_decimal value = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};
  s21_set_sign(&value, 1);  // MAX negative
  s21_decimal result;
  s21_decimal expected = {
      {0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX positive

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_sign(result), 0);
}
END_TEST

START_TEST(test_negate_with_scale_positive) {
  s21_decimal value = {{12345, 0, 0, 0}};
  s21_set_scale(&value, 2);  // 123.45
  s21_decimal result;
  s21_decimal expected = {{12345, 0, 0, 0}};
  s21_set_scale(&expected, 2);
  s21_set_sign(&expected, 1);  // -123.45

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_sign(result), 1);
  ck_assert_int_eq(s21_get_scale(result), 2);  // Scale должен сохраниться
}
END_TEST

START_TEST(test_negate_with_scale_negative) {
  s21_decimal value = {{12345, 0, 0, 0}};
  s21_set_scale(&value, 2);
  s21_set_sign(&value, 1);  // -123.45
  s21_decimal result;
  s21_decimal expected = {{12345, 0, 0, 0}};
  s21_set_scale(&expected, 2);  // +123.45

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  ck_assert_int_eq(s21_get_sign(result), 0);
  ck_assert_int_eq(s21_get_scale(result), 2);
}
END_TEST

START_TEST(test_negate_null_pointer) {
  s21_decimal value = {{5, 0, 0, 0}};

  int status = s21_negate(value, NULL);

  ck_assert_int_eq(status, 1);  // Должна вернуть ошибку при NULL указателе
}
END_TEST

START_TEST(test_negate_preserves_mantissa) {
  s21_decimal value = {
      {0x12345678, 0x135752DF, 0x13579BDF, 0}};  // Произвольная мантисса
  s21_set_scale(&value, 5);
  s21_decimal result;

  int status = s21_negate(value, &result);

  ck_assert_int_eq(status, 0);
  // Проверяем, что мантисса не изменилась
  ck_assert_int_eq(result.bits[0], 0x12345678);
  ck_assert_int_eq(result.bits[1], 0x135752DF);
  ck_assert_int_eq(result.bits[2], 0x13579BDF);
  ck_assert_int_eq(s21_get_scale(result), 5);  // Scale сохранился
}
END_TEST

Suite *s21_negate_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_negate");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_negate_basic_positive);
  tcase_add_test(tc, test_negate_basic_negative);
  tcase_add_test(tc, test_negate_zero_positive);
  tcase_add_test(tc, test_negate_zero_negative);
  tcase_add_test(tc, test_negate_large_number_positive);
  tcase_add_test(tc, test_negate_large_number_negative);
  tcase_add_test(tc, test_negate_with_scale_positive);
  tcase_add_test(tc, test_negate_with_scale_negative);
  tcase_add_test(tc, test_negate_null_pointer);
  tcase_add_test(tc, test_negate_preserves_mantissa);

  suite_add_tcase(s, tc);
  return s;
}