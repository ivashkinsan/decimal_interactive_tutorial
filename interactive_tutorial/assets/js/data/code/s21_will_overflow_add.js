export const s21_will_overflow_add_code = `#include "s21_decimal.h"

/* Проверка на переполнение при сложении двах мантисс.
0 - переполнения нет, 1 - переполнение.
*/

int s21_will_overflow_add(s21_decimal value_1, s21_decimal value_2) {
  int res = 0;
  long long unsigned int addnum = 0, summ = 0;
  for (int i = 0; i < 3; i++) {
    summ = (long long unsigned int)value_1.bits[i] +
           (long long unsigned int)value_2.bits[i] + addnum;
    // псевдозануление, как будто зануляем инт, хотя у нас ull
    addnum = summ >> 32;
  }
  if (addnum) res = 1;
  return res;
}
`;