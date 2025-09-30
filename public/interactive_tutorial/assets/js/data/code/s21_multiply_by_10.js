export const s21_multiply_by_10_code = `#include "s21_decimal.h"

/* Умножает мантиссу decimal числа на 10 без изменения знака и scale.
Функция обрабатывает потенциальное переполнение 96-битной мантиссы.
Возвращает 0 - успех, 1 ошибка (NULL указатель или переполнение).
*/

int s21_multiply_by_10(s21_decimal *value) {
  if (!value) return 1;
  if (s21_is_zero(*value)) return 0;
  int res = 0;
  s21_decimal temp1 = *value;
  s21_decimal temp2 = *value;
  int sign = s21_get_sign(*value);
  int scale = s21_get_scale(*value);
  // value * 10 == (temp1 << 3) | (temp2 << 1)
  if (s21_will_overflow_left(temp1, 3) || s21_will_overflow_left(temp2, 1))
    res = 1;
  else {
    s21_shift_left(&temp1, 3);
    s21_shift_left(&temp2, 1);
    if (s21_will_overflow_add(temp1, temp2))
      res = 1;
    else {
      s21_add_mantissa(temp1, temp2, value);
      s21_set_sign(value, sign);
      s21_set_scale(value, scale);
    }
  }
  return res;
}
`;