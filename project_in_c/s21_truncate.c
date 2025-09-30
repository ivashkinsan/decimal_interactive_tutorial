#include "s21_decimal.h"

/*Функция записывает в *result целые цифры указанного Decimal числа value;
 любые дробные цифры отбрасываются, включая конечные нули.
Возвращает 0 - успех, 1 - ошибка (указатель NULL).
*/

int s21_truncate(s21_decimal value, s21_decimal *result) {
  if (result == NULL) return 1;
  int res = 1;

  int scale = s21_get_scale(value);
  if ((scale >= 0) && (scale <= 28)) {
    *result = value;
    int balance = s21_reduce_to_scale(result, scale, 0);
    if (balance != -1) res = 0;
  }

  return res;
}