#include "s21_tests.h"

START_TEST(test_add_positive_simple) {
  s21_decimal value1 = {{5, 0, 0, 0}};  // 5
  s21_decimal value2 = {{3, 0, 0, 0}};  // 3
  s21_decimal result;
  s21_decimal expected = {{8, 0, 0, 0}};  // 8

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_negative_simple) {
  s21_decimal value1 = {{5, 0, 0, 0}};
  s21_decimal value2 = {{3, 0, 0, 0}};
  s21_set_sign(&value1, 1);  // -5
  s21_set_sign(&value2, 1);  // -3
  s21_decimal result;
  s21_decimal expected = {{8, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -8

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_mixed_signs_positive_result) {
  s21_decimal value1 = {{10, 0, 0, 0}};
  s21_set_sign(&value1, 1);             // -10
  s21_decimal value2 = {{3, 0, 0, 0}};  // +3
  s21_decimal result;
  s21_decimal expected = {{7, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -7

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_mixed_signs_negative_result) {
  s21_decimal value1 = {{3, 0, 0, 0}};
  s21_set_sign(&value1, 1);              // -3
  s21_decimal value2 = {{10, 0, 0, 0}};  // 10
  s21_decimal result;
  s21_decimal expected = {{7, 0, 0, 0}};
  s21_set_sign(&expected, 1);  // -7

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 0);
}
END_TEST

START_TEST(test_add_zero_cases) {
  s21_decimal zero = {{0, 0, 0, 0}};
  s21_decimal five = {{5, 0, 0, 0}};
  s21_decimal result;

  // 0 + 5 = 5
  int status1 = s21_add(zero, five, &result);
  ck_assert_int_eq(status1, 0);
  ck_assert_int_eq(s21_is_equal(result, five), 1);

  // 5 + 0 = 5
  int status2 = s21_add(five, zero, &result);
  ck_assert_int_eq(status2, 0);
  ck_assert_int_eq(s21_is_equal(result, five), 1);

  // 0 + 0 = 0
  int status3 = s21_add(zero, zero, &result);
  ck_assert_int_eq(status3, 0);
  ck_assert_int_eq(s21_is_equal(result, zero), 1);
}
END_TEST

START_TEST(test_add_with_different_scales) {
  s21_decimal value1 = {{123, 0, 0, 0}};  // 1.23
  s21_decimal value2 = {{456, 0, 0, 0}};  // 4.56
  s21_set_scale(&value1, 2);
  s21_set_scale(&value2, 2);
  s21_decimal result;
  s21_decimal expected = {{579, 0, 0, 0}};  // 5.79
  s21_set_scale(&expected, 2);

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_very_different_scales) {
  s21_decimal value1 = {{123, 0, 0, 0}};  // 123
  s21_decimal value2 = {{456, 0, 0, 0}};  // 0.456
  s21_set_scale(&value2, 3);
  s21_decimal result;
  s21_decimal expected = {{123456, 0, 0, 0}};  // 123.456
  s21_set_scale(&expected, 3);

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_negative_with_scales) {
  s21_decimal value1 = {{100, 0, 0, 0}};  // -1.00
  s21_decimal value2 = {{50, 0, 0, 0}};   // -0.50
  s21_set_sign(&value1, 1);
  s21_set_sign(&value2, 1);
  s21_set_scale(&value1, 2);
  s21_set_scale(&value2, 2);
  s21_decimal result;
  s21_decimal expected = {{150, 0, 0, 0}};  // -1.50
  s21_set_sign(&expected, 1);
  s21_set_scale(&expected, 2);

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_mixed_signs_with_scales) {
  s21_decimal value1 = {{150, 0, 0, 0}};  // 1.50
  s21_decimal value2 = {{75, 0, 0, 0}};   // -0.75
  s21_set_sign(&value2, 1);
  s21_set_scale(&value1, 2);
  s21_set_scale(&value2, 2);
  s21_decimal result;
  s21_decimal expected = {{75, 0, 0, 0}};  // 0.75
  s21_set_scale(&expected, 2);

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_large_numbers) {
  s21_decimal value1 = {{0xFFFFFFF0, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // Почти MAX
  s21_decimal value2 = {{0x0000000F, 0, 0, 0}};                    // +15
  s21_decimal result;
  s21_decimal expected = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_overflow_positive) {
  s21_decimal value1 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_decimal value2 = {{1, 0, 0, 0}};                             // +1
  s21_decimal result;

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 1);  // Должна вернуть ошибку переполнения
}
END_TEST

START_TEST(test_add_overflow_negative) {
  s21_decimal value1 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};
  s21_set_sign(&value1, 1);  // -MAX
  s21_decimal value2 = {{1, 0, 0, 0}};
  s21_set_sign(&value2, 1);  // -1
  s21_decimal result;

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status,
                   2);  // Должна вернуть ошибку отрицательного переполнения
}
END_TEST

START_TEST(test_add_negative_zero_result) {
  s21_decimal value1 = {{5, 0, 0, 0}};
  s21_set_sign(&value1, 1);             // -5
  s21_decimal value2 = {{5, 0, 0, 0}};  // +5
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};  // 0

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
  // Результат должен быть +0 (знак не имеет значения для нуля)
}
END_TEST

START_TEST(test_add_positive_zero_result) {
  s21_decimal value1 = {{5, 0, 0, 0}};  // +5
  s21_decimal value2 = {{5, 0, 0, 0}};
  s21_set_sign(&value2, 1);  // -5
  s21_decimal result;
  s21_decimal expected = {{0, 0, 0, 0}};  // 0

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_null_pointer) {
  s21_decimal value1 = {{5, 0, 0, 0}};
  s21_decimal value2 = {{3, 0, 0, 0}};

  int status = s21_add(value1, value2, NULL);

  ck_assert_int_eq(status, 1);  // Должна вернуть ошибку при NULL указателе
}
END_TEST

START_TEST(test_add_max_scale_normalization) {
  s21_decimal value1 = {{1, 0, 0, 0}};  // 0.0000000000000000000000000001
  s21_decimal value2 = {{1, 0, 0, 0}};  // 0.0000000000000000000000000001
  s21_set_scale(&value1, 28);
  s21_set_scale(&value2, 28);
  s21_decimal result;
  s21_decimal expected = {{2, 0, 0, 0}};  // 0.0000000000000000000000000002
  s21_set_scale(&expected, 28);

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 1);
}
END_TEST

START_TEST(test_add_large_v1_and_small_v2_normalization) {
  s21_decimal value1 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_decimal value2 = {{1, 0, 0, 0}};  // -0.0000000000000000000000000001
  s21_set_scale(&value2, 28);
  s21_set_sign(&value2, 1);
  s21_decimal result;
  s21_decimal expected = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_set_scale(&expected, 28);

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 0);
}
END_TEST

START_TEST(test_add_small_v1_and_large_v2_normalization) {
  s21_decimal value1 = {{1, 0, 0, 0}};  // -0.0000000000000000000000000001
  s21_set_scale(&value1, 28);
  s21_set_sign(&value1, 1);
  s21_decimal value2 = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_decimal result;
  s21_decimal expected = {{0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0}};  // MAX
  s21_set_scale(&expected, 28);

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
  ck_assert_int_eq(s21_is_equal(result, expected), 0);
}
END_TEST

START_TEST(test_add_very_big_same_scales) {
  s21_decimal value1 = {{1, 0, 0, 0}};  // +0.00..01
  s21_decimal value2 = {{1, 0, 0, 0}};  // +0.00..01
  s21_set_scale(&value1, 30);
  s21_set_scale(&value2, 30);
  s21_decimal result;

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
}
END_TEST

START_TEST(test_add_close_to_ow1_case) {
  s21_decimal value1 = {{~0U, ~0U, ~0U, 2 << 16 | 0 << 31}};
  s21_decimal value2 = {{~0U, ~0U, ~0U, 2 << 16 | 0 << 31}};
  s21_decimal result;

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
}
END_TEST

START_TEST(test_add_close_to_ow2_case) {
  s21_decimal value1 = {{~0U << 1, ~0U, ~0U, 0 << 16 | 0 << 31}};
  s21_decimal value2 = {{14, 0, 0, 1 << 16 | 0 << 31}};
  s21_decimal result;

  int status = s21_add(value1, value2, &result);

  ck_assert_int_eq(status, 0);
}
END_TEST

Suite *s21_add_suite(void) {
  Suite *s;
  TCase *tc;

  s = suite_create("s21_add");
  tc = tcase_create("Core");

  tcase_add_test(tc, test_add_positive_simple);
  tcase_add_test(tc, test_add_negative_simple);
  tcase_add_test(tc, test_add_mixed_signs_positive_result);
  tcase_add_test(tc, test_add_mixed_signs_negative_result);
  tcase_add_test(tc, test_add_zero_cases);
  tcase_add_test(tc, test_add_with_different_scales);
  tcase_add_test(tc, test_add_very_different_scales);
  tcase_add_test(tc, test_add_negative_with_scales);
  tcase_add_test(tc, test_add_mixed_signs_with_scales);
  tcase_add_test(tc, test_add_large_numbers);
  tcase_add_test(tc, test_add_overflow_positive);
  tcase_add_test(tc, test_add_overflow_negative);
  tcase_add_test(tc, test_add_negative_zero_result);
  tcase_add_test(tc, test_add_positive_zero_result);
  tcase_add_test(tc, test_add_null_pointer);
  tcase_add_test(tc, test_add_max_scale_normalization);
  tcase_add_test(tc, test_add_large_v1_and_small_v2_normalization);
  tcase_add_test(tc, test_add_small_v1_and_large_v2_normalization);
  tcase_add_test(tc, test_add_very_big_same_scales);
  tcase_add_test(tc, test_add_close_to_ow1_case);
  tcase_add_test(tc, test_add_close_to_ow2_case);

  suite_add_tcase(s, tc);
  return s;
}