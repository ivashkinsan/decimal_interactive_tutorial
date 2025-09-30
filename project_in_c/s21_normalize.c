#include "s21_decimal.h"

/* Выравнивает scale (экспоненту) двух decimal чисел для выполнения
арифметических операций. Увеличивает scale меньшего числа, умножая его мантиссу
на степени 10. Если это не получается (s21_multiply_by_10 возвращает не 0), то
пытаемся реализовать функцию s21_decrease_and_round, которая делит мантиссу
числа с бОльшим scale на 10 и применяет банковское окургление.
В случае успеха уменьшает scale этого числа на 1.
 Возвращает 0 - успех или 1 - ошибка (укзатель NULL или невозможно
нормализовать.)
*/

int s21_normalize(s21_decimal *value_1, s21_decimal *value_2) {
  if (!value_1 || !value_2) return 1;

  int scale1 = s21_get_scale(*value_1);
  int scale2 = s21_get_scale(*value_2);
  int res = 0;

  while (scale1 != scale2 && res == 0) {
    if (scale1 < scale2) {
      if (s21_multiply_by_10(value_1) == 0) {
        scale1++;
        s21_set_scale(value_1, scale1);
      } else {
        res = s21_decrease_and_round(value_2);
        if (res == 0) scale2--;
      }
    } else {
      if (s21_multiply_by_10(value_2) == 0) {
        scale2++;
        s21_set_scale(value_2, scale2);
      } else {
        res = s21_decrease_and_round(value_1);
        if (res == 0) scale1--;
      }
    }
  }

  return res;
}

int s21_decrease_and_round(s21_decimal *value) {
  int res = 0;
  int balance = s21_decrease_scale(value);
  if (balance == -1)
    res = 1;
  else
    res = s21_bank_rounding(value, balance);
  return res;
}