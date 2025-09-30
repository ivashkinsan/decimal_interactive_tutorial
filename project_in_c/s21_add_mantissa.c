#include "s21_decimal.h"

/*Увеличивает мантиссу числа value_1 на value_2 и записывает итог в *result.
0 - успех, 1 - ошибка (NULL в указателе или переполнение) */

int s21_add_mantissa(s21_decimal value_1, s21_decimal value_2,
                     s21_decimal *result) {
  if (result == NULL) return 1;
  int res = 0;
  if (s21_will_overflow_add(value_1, value_2))
    res = 1;
  else {
    unsigned int addnum = 0;

    for (int i = 0; i < 3; i++) {
      unsigned int a = (unsigned int)value_1.bits[i];
      unsigned int b = (unsigned int)value_2.bits[i];
      unsigned long long summ = (unsigned long long)a + (unsigned long long)b +
                                (unsigned long long)addnum;
      result->bits[i] = (int)(summ & 0xFFFFFFFF);
      addnum = (unsigned int)(summ >> 32);
    }
  }
  return res;
}