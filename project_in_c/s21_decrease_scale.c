#include "s21_decimal.h"

/* Отбрасывает последнюю цифру мантисы числа value  и уменьшает значение scale
на 1. Функция возвращает значиние отброшенной цифры (0-9), если выполнена
успешно и -1 в случае ошибки (указатель NULL, либо scale меньше или равно 0).
*/

int s21_decrease_scale(s21_decimal *value) {
  if (!value) return -1;
  int sign = s21_get_sign(*value);
  int scale = s21_get_scale(*value);
  long long unsigned int balance = 0;
  if (scale <= 0)
    balance = (int)-1;
  else {
    for (int i = 2; i >= 0; i--) {
      long long unsigned int temp = ((long long unsigned int)balance << 32) +
                                    (unsigned int)value->bits[i];
      value->bits[i] = temp / 10;
      balance = temp % 10;
    }
    s21_set_scale(value, scale - 1);
    s21_set_sign(value, sign);
  }
  return (int)balance;
}