#include "s21_decimal.h"

/* Функция не требуется по заданию, но просто, чтобы увидеть побитовое
представление числа value.
Ничего не возвращает.
*/

void s21_print(s21_decimal value) {
  int sign = s21_get_sign(value);
  char sgn = '+';
  if (sign) sgn = '-';

  int scale = s21_get_scale(value);
  printf("bits[3]: ");
  for (int i = 31; i >= 0; i--) {
    printf("%d", (value.bits[3] >> i) & 1);
    if (i % 8 == 0 && i != 0) printf(" ");
  }
  printf(" scale = %d; sign = \"%c\" \n", scale, sgn);

  for (int n = 2; n >= 0; n--) {
    printf("bits[%d]: ", n);
    for (int i = 31; i >= 0; i--) {
      printf("%d", (value.bits[n] >> i) & 1);
      if (i % 8 == 0 && i != 0) printf(" ");
    }
    printf(" %u\n", value.bits[n]);
  }
}