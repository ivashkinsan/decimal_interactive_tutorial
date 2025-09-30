export const s21_divide_by_10_code = `#include "s21_decimal.h"

/*
Делит мантиссу decimal числа на 10 и увеличивает scale на 1 (если scale < 28).
Возвращает 0 - успех, 1 - ошибка(указатель NULL или scale > 27).
*/

int s21_divide_by_10(s21_decimal *value) {
  if (!value) return 1;
  int res = 0;
  int sign = s21_get_sign(*value);
  int scale = s21_get_scale(*value);
  if (scale > 27)
    res = 1;
  else {
    scale++;
    s21_set_scale(value, scale);
    if (s21_is_zero(*value))
      ;
    else {
      long long unsigned int balance = 0;

      for (int i = 2; i >= 0; i--) {
        long long unsigned int temp = ((long long unsigned int)balance << 32) +
                                      (unsigned int)value->bits[i];
        value->bits[i] = temp / 10;
        balance = temp % 10;
      }
      s21_set_sign(value, sign);
    }
  }
  return res;
}
`;