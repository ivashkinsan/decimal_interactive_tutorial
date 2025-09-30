#include "s21_decimal.h"

/* Сдвигаем мантиссу числа value на 1 бит вправо.
Возвращает 0 - успех, 1 - ошибка (указатель NULL или сдвиг меньше нуля).
На перепеполнение при сдвиге вправо не проверяем.
*/

int s21_shift_right(s21_decimal *value, int shift) {
  if (shift == 0 || s21_is_zero(*value)) return 0;
  if ((shift < 0) || (value == NULL)) return 1;

  int sign = s21_get_sign(*value);
  int scale = s21_get_scale(*value);

  for (int i = 0; i < shift; i++) {
    int check_right_bit_1 = 0;
    if (value->bits[1] & 1) check_right_bit_1 = 1;
    int check_right_bit_2 = 0;
    if (value->bits[2] & 1) check_right_bit_2 = 1;

    value->bits[0] = (unsigned int)value->bits[0] >> 1;
    value->bits[1] = (unsigned int)value->bits[1] >> 1;
    value->bits[2] = (unsigned int)value->bits[2] >> 1;

    if (check_right_bit_1) value->bits[0] |= (1 << 31);
    if (check_right_bit_2) value->bits[1] |= (1 << 31);
  }

  s21_set_sign(value, sign);
  s21_set_scale(value, scale);
  return 0;
}