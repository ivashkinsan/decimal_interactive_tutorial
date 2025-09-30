#include "s21_decimal.h"

/* Проверка на переполнение при сложении двах мантисс.
0 - переполнения нет, 1 - переполнение.
*/

int s21_will_overflow_add(s21_decimal value_1, s21_decimal value_2) {
  unsigned long long addnum = 0;

  for (int i = 0; i < 3; i++) {
    unsigned long long a = (unsigned long long)(unsigned int)value_1.bits[i];
    unsigned long long b = (unsigned long long)(unsigned int)value_2.bits[i];
    unsigned long long summ = a + b + addnum;

    addnum = summ >> 32;
  }

  return (addnum > 0) ? 1 : 0;
}