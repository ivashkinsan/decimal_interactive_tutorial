#include "s21_decimal.h"

/*Функция округляет указанное Decimal число до ближайшего целого числа
в сторону отрицательной бесконечности.
Возвращает 0 - успех, 1 - ошибка (указатель NULL или ошибка вычисления).
*/

int s21_floor(s21_decimal value, s21_decimal *result) {
  if (result == NULL) return 1;
  int res = 1;
  int sign = s21_get_sign(value);
  s21_decimal zero = {{0}};
  *result = zero;
  res = s21_truncate(value, result);
  if (sign == 1 && res == 0) {
    s21_decimal exp = {{0}};
    s21_sub(value, *result, &exp);
    int exp_exist = s21_is_zero(exp);  // 1 - exp==0, 0 - exp != 0
    if (exp_exist == 0) {
      s21_decimal one = {{1, 0, 0, 0}};
      res = s21_sub(*result, one, result);
    }
  }
  s21_set_sign(result, sign);

  return res;
}
