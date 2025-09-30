#include "s21_decimal.h"

/* Вычитает из мантиссы value_1 мантиссу value_2 и записывает итог в *result.
0 - успех, 1 - ошибка (NULL в указателе или мантисса value_2 > мантиссы value_1)
*/

int s21_sub_mantissa(s21_decimal value_1, s21_decimal value_2,
                     s21_decimal *result) {
  if (result == NULL) return 1;
  if (s21_mantissa_compare(value_1, value_2) == -1) return 1;

  unsigned long long int balance = 0;
  for (int i = 0; i < 3; i++) {
    unsigned int a = (unsigned int)value_1.bits[i];
    unsigned int b = (unsigned int)value_2.bits[i];
    unsigned long long int diff =
        (unsigned long long int)a - (unsigned long long int)b - balance;
    result->bits[i] = (unsigned int)diff;
    if ((unsigned long long int)a < ((unsigned long long int)b + balance))
      balance = 1;
    else
      balance = 0;
  }
  return 0;
}