#include "s21_decimal.h"

/* Устанавливает 31-й бит знака sign для числа value
(1 - минус, 0 - плюс).
Ничего не возвращает.
*/

void s21_set_sign(s21_decimal *value, int sign) {
  if (value == NULL) return;
  int scale = s21_get_scale(*value);
  value->bits[3] = scale << 16;
  if (sign)
    // 1 << 31 = 1000000 0000000 0000000 0000000
    value->bits[3] = (value->bits[3] & (~0U >> 1)) | (1 << 31);
}