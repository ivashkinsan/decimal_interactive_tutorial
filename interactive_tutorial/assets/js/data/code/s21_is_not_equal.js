export const s21_is_not_equal_code = `#include "s21_decimal.h"

/*Проверяем, что value_1 и value_2 НЕ равны.
1 - НЕ равны, 0 - равны. (Так по заданию).
*/

int s21_is_not_equal(s21_decimal value_1, s21_decimal value_2) {
  return !s21_is_equal(value_1, value_2);
}

/* Альтернатива, на всякий случай, если что, потом удалим.
if(s21_is_zero(value_1) && s21_is_zero(value_2)) return 0;
int res = 1;
int sign1 = s21_get_sign(value_1);
int sign2 = s21_get_sign(value_2);

if(sign1 == sign2) {
if(s21_normalize(&value_1, &value_2) == 0) {
if(s21_mantissa_compare(value_1, value_2) == 0) res = 0;
}
}

return res;
}
*/
`;