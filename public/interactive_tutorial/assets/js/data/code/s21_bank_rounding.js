
export const s21_bank_rounding_code = `#include "s21_decimal.h"

/*Реализует банковское округление (round half to even) для decimal
числа при обработке переполнения. 0 - успешное завершение, 1 - ошибка.
Аргумент balance = остаток от деления x%10 (где x - наше число s21_decimal
value). Аргумент balance является результатом возвращаемого значения balance от
функции s21_decrease_scale: balance = s21_decrease_scale(value). Что такое
банковское округление: Обычное округление: 1.5 -> 2, 2.5 -> 3. При остатке 5
всегда округляем до бОльшего. Банковское округление 1.5 -> 2, 2.5 -> 2. При
остатке 5 если предпоследняя цифра нечетная, округляем до бОльшего, а если
четная, то до нее. Если остаток (последняя цифра) меньше 5 или больше 5, то
банковское округление = обычное округление.
*/

int s21_bank_rounding(s21_decimal *value, int balance) {
  if (!value) return 1;
  int res = -1;
  int scale = s21_get_scale(*value);
  int condition = 0;
  int func_returned = 0;

  while (res == -1) {
    condition = balance > 5 || (balance == 5 && s21_is_even(*value));
    if (!condition) {
      res = 0;
      continue;
    }

    s21_decimal one = {{1, 0, 0, 0}};
    func_returned = s21_add_mantissa(*value, one, value);

    if (func_returned == 0) {
      res = 0;
      continue;
    }

    if (scale == 0) {
      res = 1;
      continue;
    }

    balance = s21_decrease_scale(value);
    s21_set_scale(value, scale);

    if (balance == 0) res = 0;
  }

  return res;
}
`;
