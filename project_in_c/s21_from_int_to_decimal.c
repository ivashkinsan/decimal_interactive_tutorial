//
// Created by username on 17.09.2025.
//

#include "s21_decimal.h"

int s21_from_int_to_decimal(int src, s21_decimal *dst) {
  int res = 0;
  // long unsigned temp = src;
  if (s21_set_decimal_zero(dst) == 1) res = 1;

  if (res == 0) {
    s21_set_sign(dst, src < 0);

    for (int i = 0; i < (int)(sizeof(src) * 8);
         i++) {  //-1 в условии чтобы не читать знаковый бит

      dst->bits[0] |= s21_read_bit_integer(abs(src), i);
    }
  }
  return res;
}
