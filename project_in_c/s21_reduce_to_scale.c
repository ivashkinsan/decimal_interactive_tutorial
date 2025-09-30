#include "s21_decimal.h"

/* Отбрасывает последнюю цифру мантисы числа value  и уменьшает значение scale
с текущего from_scale до значения to_scale.
Функция возвращает значиние отброшенной цифры (0-9), если выполнена успешно
и -1 в случае ошибки (указатель NULL).
*/

int s21_reduce_to_scale(s21_decimal *value, int from_scale, int to_scale) {
  if (value == NULL) return -1;
  if (from_scale <= to_scale) return 0;

  int balance = 0;

  for (int i = from_scale; (i > to_scale) && (balance != -1); i--)
    balance = s21_decrease_scale(value);

  return balance;
}