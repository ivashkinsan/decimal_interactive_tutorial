export const s21_shift_left_code = `#include "s21_decimal.h"

/* Сдвигает мантиссу влево на 1 бит.
Возвращает 0 - успех, 1 - ошибка (NULL указатель, либо сдвиг меньше нуля,
либо сдвиг больше 96 при ненулевой мантиссе), 2 - переполнение.
*/

int s21_shift_left(s21_decimal *value, int shift) {
  if (shift == 0 || s21_is_zero(*value)) return 0;
  if ((shift < 0) || (value == NULL)) return 1;
  if (shift >= 96) return !s21_is_zero(*value);
  if (s21_will_overflow_left(*value, shift)) return 2;

  int sign = s21_get_sign(*value);
  int scale = s21_get_scale(*value);

  for (int i = 0; i < shift; i++) {
    int check_left_bit_0 = 0;
    if (value->bits[0] & (1 << 31)) check_left_bit_0 = 1;
    int check_left_bit_1 = 0;
    if (value->bits[1] & (1 << 31)) check_left_bit_1 = 1;

    value->bits[0] = (unsigned int)value->bits[0] << 1;
    value->bits[1] = (unsigned int)value->bits[1] << 1;
    value->bits[2] = (unsigned int)value->bits[2] << 1;

    if (check_left_bit_0) value->bits[1] |= 1;
    if (check_left_bit_1) value->bits[2] |= 1;
  }

  s21_set_sign(value, sign);
  s21_set_scale(value, scale);
  return 0;
}
`;