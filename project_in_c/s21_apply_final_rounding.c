#include "s21_decimal.h"

/*Функция реализует корректное сложение мантисс для случаев, когда
сумма вызывает переполнение и требуется округление результата *result.
Возвращает 0 - успех, 1 - ошибка.
*/

int s21_apply_final_rounding(s21_decimal *result, int balance1, int balance2,
                             int scale) {
  int total_balance = balance1 + balance2;
  int has_carry = total_balance >= 10;
  int rounding_balance = total_balance % 10;
  int overflow = 0;

  if (has_carry) {
    s21_decimal one = {{1, 0, 0, 0}};
    s21_set_scale(&one, scale);
    overflow = s21_add_mantissa(*result, one, result);
  }

  if (!overflow && rounding_balance > 0) {
    overflow = s21_bank_rounding(result, rounding_balance);
  }

  return overflow;
}