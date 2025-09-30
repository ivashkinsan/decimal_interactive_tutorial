export const s21_normalize_code = `#include "s21_decimal.h"

/* Выравнивает scale (экспоненту) двух decimal чисел для выполнения
арифметических операций. Увеличивает scale меньшего числа, умножая его мантиссу
на степени 10. Возвращает 0 - успех или 1 - ошибка (укзатель NULL или невозможно
нормализовать.)
*/

int s21_normalize(s21_decimal *value_1, s21_decimal *value_2) {
  if (!value_1 || !value_2) return 1;
  int res = 0;
  int scale1 = s21_get_scale(*value_1);
  int scale2 = s21_get_scale(*value_2);
  if (scale1 < scale2) {
    while (scale1 < scale2 && res == 0) {
      if (!s21_is_zero(*value_1)) {
        int s = s21_multiply_by_10(value_1);
        if (s == 1) {
          res = 1;
          break;
        }
      }
      scale1++;
      if (scale1 > 28)
        res = 1;
      else
        s21_set_scale(value_1, scale1);
    }
  } else if (scale1 > scale2) {
    while (scale1 > scale2 && res == 0) {
      if (!s21_is_zero(*value_2)) {
        int s = s21_multiply_by_10(value_2);
        if (s == 1) {
          res = 1;
          break;
        }
      }
      scale2++;
      if (scale2 > 28)
        res = 1;
      else
        s21_set_scale(value_2, scale2);
    }
  }
  return res;
}
`;