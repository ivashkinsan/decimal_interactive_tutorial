#include "s21_decimal.h"

/*Функция выполняет сложение двух чисел s21_decimal с одинаковым знаком sign в
*result с банковским округлением и с учетом изначального значиния scale (до
округления суммы мантисс). 0 - Успех, 1 - ошибка (указатель NULL или слишком
большое число), 2 - ошибка (слишком маленькое число)
*/

int s21_add_with_rounding(s21_decimal original_v1, s21_decimal original_v2,
                          s21_decimal *result, int original_scale, int sign) {
  int overflow = 0;
  int res = -1;
  int final_scale = original_scale;

  for (int current_scale = original_scale; (current_scale >= 0) && (res == -1);
       current_scale--) {
    s21_decimal v1 = original_v1;
    s21_decimal v2 = original_v2;

    int balance1 = s21_reduce_to_scale(&v1, original_scale, current_scale);
    int balance2 = s21_reduce_to_scale(&v2, original_scale, current_scale);

    if (balance1 == -1 || balance2 == -1) {
      continue;
    }

    s21_set_scale(&v1, current_scale);
    s21_set_scale(&v2, current_scale);

    overflow = s21_add_mantissa(v1, v2, result);

    if (!overflow) {
      final_scale = current_scale;

      overflow =
          s21_apply_final_rounding(result, balance1, balance2, final_scale);

      if (!overflow) {
        s21_set_sign(result, sign);
        s21_set_scale(result, final_scale);
        res = 0;
      } else {
        continue;
      }
    }
  }

  if (res == -1) {
    res = (sign == 0) ? 1 : 2;
  }

  return res;
}