#include "s21_decimal.h"

/* Устанавливает значение scale для числа value.
Ничего не возвращает.
*/

void s21_set_scale(s21_decimal *value, int scale) {
  if (value == NULL) return;
  int sign = s21_get_sign(*value);
  if (scale < 0) scale = 0;
  if (scale > 28) scale = 28;
  value->bits[3] = scale << 16;
  if (sign)
    // 1 << 31 = 1000000 0000000 0000000 0000000
    value->bits[3] = (value->bits[3] & (~0U >> 1)) | (1 << 31);
}