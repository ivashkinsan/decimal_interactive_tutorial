export const s21_is_zero_code = `#include "s21_decimal.h"

/* Проверяет, является ли значение мантиссы числа value нулем.
Возвращает 1 - Да, 0 - Нет.
*/

int s21_is_zero(s21_decimal value) {
  int res = 0;
  if ((value.bits[0] == 0) && (value.bits[1] == 0) && (value.bits[2] == 0))
    res = 1;
  return res;
}
`;