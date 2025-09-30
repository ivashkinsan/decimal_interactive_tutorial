//
// Created by username on 24.09.2025.
//
#include "s21_decimal.h"

int s21_read_bit_integer(int src, int bit_number) {
  int bit = 0;
  bit = src & (1u << (bit_number));
  return bit;
}

// int s21_read_bit_float (float src, int bit_number) {
//     int bit = 0;
//     bit = src & ((float)1 << (float)bit_number);
//     return bit;
// }