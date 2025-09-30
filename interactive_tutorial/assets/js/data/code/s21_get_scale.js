export const s21_get_scale_code = `#include "s21_decimal.h"

/* Извлекает значение scale из числа value.
Возвращает это значение.
*/

int s21_get_scale(s21_decimal value) {
  int res = (value.bits[3] >> 16) & 255;
  return res;
}
`;