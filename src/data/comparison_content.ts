export const comparisonContent = {
  comparison_operators: {
    id: 'comparison_operators',
    title: 'Операторы сравнения',
    description: 'Обзор всех операторов сравнения.',
    template: `
      <h3>Операторы сравнения</h3>
      <p>Операторы сравнения позволяют определить соотношение между двумя числами <code>s21_decimal</code>.</p>
      <h4>Пример использования:</h4>
      <pre><code class="c">
#include "s21_decimal.h"
#include <stdio.h>

int main() {
    s21_decimal val1, val2;
    s21_from_int_to_decimal(10, &val1);
    s21_from_int_to_decimal(20, &val2);

    if (s21_is_less(val1, val2)) {
        printf("10 меньше 20\n"); // Этот код выполнится
    }

    if (s21_is_greater(val1, val2)) {
        // Этот код не выполнится
    }

    return 0;
}
      </code></pre>
      <p>В интерактивном симуляторе ниже вы можете поэкспериментировать со всеми операторами сравнения.</p>
    `,
    interactive: 'comparison_simulator_all',
    operatorDetails: [
      {
        type: "is_less",
        title: "s21_is_less",
        description: `Проверяет, является ли первое десятичное число меньше второго.
        Checks if the first decimal is less than the second.`,
        code: `int s21_is_less(s21_decimal value_1, s21_decimal value_2);`,
        details: [
            "Returns 1 if value_1 < value_2, otherwise 0.",
            "Return value: int (0 or 1)",
        ],
        longDescriptionHtml: `
            <h3>Функция s21_is_less</h3>
            <p>Функция <code>s21_is_less</code> определяет, является ли первое десятичное число (<code>value_1</code>) строго меньше второго (<code>value_2</code>).</p>

            <h4>Принцип работы и реализация для s21_decimal:</h4>
            <ol>
                <li><b>Нормализация:</b> Прежде всего, оба числа <code>value_1</code> и <code>value_2</code> приводятся к одному и тому же масштабу (степени). Это необходимо для того, чтобы их мантиссы можно было корректно сравнивать. Если масштабы разные, мантисса числа с меньшим масштабом умножается на 10 до тех пор, пока масштабы не станут равными.</li>
                <li><b>Сравнение знаков:</b>
                    <ul>
                        <li>Если знаки чисел разные (одно положительное, другое отрицательное), то отрицательное число всегда считается меньшим.</li>
                        <li>Если <code>value_1</code> отрицательное, а <code>value_2</code> положительное, то <code>value_1 < value_2</code> истинно.</li>
                        <li>Если <code>value_1</code> положительное, а <code>value_2</code> отрицательное, то <code>value_1 < value_2</code> ложно.</li>
                    </ul>
                </li>
                <li><b>Сравнение мантисс (при одинаковых знаках):</b>
                    <ul>
                        <li><b>Для положительных чисел:</b> После нормализации масштабов сравниваются мантиссы. Если мантисса <code>value_1</code> меньше мантиссы <code>value_2</code>, то <code>value_1 < value_2</code> истинно.</li>
                        <li><b>Для отрицательных чисел:</b> Логика сравнения мантисс инвертируется. Если мантисса <code>value_1</code> (без учета знака) *больше* мантиссы <code>value_2</code> (без учета знака), то <code>value_1 < value_2</code> истинно. Например, -5 < -3, хотя мантисса 5 больше мантиссы 3.</li>
                    </ul>
                </li>
                <li><b>Обработка нуля:</b> Если оба числа равны нулю, они не считаются "меньше".</li>
            </ol>
            <p>Функция возвращает 1, если <code>value_1</code> меньше <code>value_2</code>, и 0 в противном случае.</p>
        `,
      },
      {
        type: "is_less_or_equal",
        title: "s21_is_less_or_equal",
        description: `Проверяет, является ли первое десятичное число меньше или равно второму.
        Checks if the first decimal is less than or equal to the second.`,
        code: `int s21_is_less_or_equal(s21_decimal value_1, s21_decimal value_2);`,
        details: [
            "Returns 1 if value_1 <= value_2, otherwise 0.",
            "Return value: int (0 or 1)",
        ],
        longDescriptionHtml: `
            <h3>Функция s21_is_less_or_equal</h3>
            <p>Функция <code>s21_is_less_or_equal</code> определяет, является ли первое десятичное число (<code>value_1</code>) меньше или равно второму (<code>value_2</code>).</p>

            <h4>Принцип работы и реализация для s21_decimal:</h4>
            <p>Реализация этой функции тесно связана с <code>s21_is_less</code> и <code>s21_is_equal</code>. Она возвращает истину, если <code>value_1</code> меньше <code>value_2</code> ИЛИ <code>value_1</code> равно <code>value_2</code>.</p>
            <ol>
                <li><b>Нормализация:</b> Как и в случае с <code>s21_is_less</code>, числа сначала нормализуются до общего масштаба.</li>
                <li><b>Сравнение знаков:</b> Обработка знаков аналогична <code>s21_is_less</code>.</li>
                <li><b>Сравнение мантисс:</b>
                    <ul>
                        <li>Если <code>value_1</code> строго меньше <code>value_2</code> (по правилам <code>s21_is_less</code>), функция возвращает 1.</li>
                        <li>В противном случае, если <code>value_1</code> не меньше <code>value_2</code>, выполняется дополнительная проверка на равенство с помощью <code>s21_is_equal</code>. Если числа равны, функция также возвращает 1.</li>
                    </ul>
                </li>
            </ol>
            <p>Функция возвращает 1, если <code>value_1</code> меньше или равно <code>value_2</code>, и 0 в противном случае.</p>
        `,
      },
      {
        type: "is_greater",
        title: "s21_is_greater",
        description: `Проверяет, является ли первое десятичное число больше второго.
        Checks if the first decimal is greater than the second.`,
        code: `int s21_is_greater(s21_decimal value_1, s21_decimal value_2);`,
        details: [
            "Returns 1 if value_1 > value_2, otherwise 0.",
            "Return value: int (0 or 1)",
        ],
        longDescriptionHtml: `
            <h3>Функция s21_is_greater</h3>
            <p>Функция <code>s21_is_greater</code> определяет, является ли первое десятичное число (<code>value_1</code>) строго больше второго (<code>value_2</code>).</p>

            <h4>Принцип работы и реализация для s21_decimal:</h4>
            <ol>
                <li><b>Нормализация:</b> Оба числа <code>value_1</code> и <code>value_2</code> приводятся к одному и тому же масштабу (степени) для корректного сравнения мантисс.</li>
                <li><b>Сравнение знаков:</b>
                    <ul>
                        <li>Если знаки чисел разные, положительное число всегда считается большим.</li>
                        <li>Если <code>value_1</code> положительное, а <code>value_2</code> отрицательное, то <code>value_1 > value_2</code> истинно.</li>
                        <li>Если <code>value_1</code> отрицательное, а <code>value_2</code> положительное, то <code>value_1 > value_2</code> ложно.</li>
                    </ul>
                </li>
                <li><b>Сравнение мантисс (при одинаковых знаках):</b>
                    <ul>
                        <li><b>Для положительных чисел:</b> После нормализации масштабов сравниваются мантиссы. Если мантисса <code>value_1</code> больше мантиссы <code>value_2</code>, то <code>value_1 > value_2</code> истинно.</li>
                        <li><b>Для отрицательных чисел:</b> Логика сравнения мантисс инвертируется. Если мантисса <code>value_1</code> (без учета знака) *меньше* мантиссы <code>value_2</code> (без учета знака), то <code>value_1 > value_2</code> истинно. Например, -3 > -5, хотя мантисса 3 меньше мантиссы 5.</li>
                    </ul>
                </li>
                <li><b>Обработка нуля:</b> Если оба числа равны нулю, они не считаются "больше".</li>
            </ol>
            <p>Функция возвращает 1, если <code>value_1</code> больше <code>value_2</code>, и 0 в противном случае.</p>
        `,
      },
      {
        type: "is_greater_or_equal",
        title: "s21_is_greater_or_equal",
        description: `Проверяет, является ли первое десятичное число больше или равно второму.
        Checks if the first decimal is greater than or equal to the second.`,
        code: `int s21_is_greater_or_equal(s21_decimal value_1, s21_decimal value_2);`,
        details: [
            "Returns 1 if value_1 >= value_2, otherwise 0.",
            "Return value: int (0 or 1)",
        ],
        longDescriptionHtml: `
            <h3>Функция s21_is_greater_or_equal</h3>
            <p>Функция <code>s21_is_greater_or_equal</code> определяет, является ли первое десятичное число (<code>value_1</code>) больше или равно второму (<code>value_2</code>).</p>

            <h4>Принцип работы и реализация для s21_decimal:</h4>
            <p>Реализация этой функции тесно связана с <code>s21_is_greater</code> и <code>s21_is_equal</code>. Она возвращает истину, если <code>value_1</code> больше <code>value_2</code> ИЛИ <code>value_1</code> равно <code>value_2</code>.</p>
            <ol>
                <li><b>Нормализация:</b> Как и в случае с <code>s21_is_greater</code>, числа сначала нормализуются до общего масштаба.</li>
                <li><b>Сравнение знаков:</b> Обработка знаков аналогична <code>s21_is_greater</code>.</li>
                <li><b>Сравнение мантисс:</b>
                    <ul>
                        <li>Если <code>value_1</code> строго больше <code>value_2</code> (по правилам <code>s21_is_greater</code>), функция возвращает 1.</li>
                        <li>В противном случае, если <code>value_1</code> не больше <code>value_2</code>, выполняется дополнительная проверка на равенство с помощью <code>s21_is_equal</code>. Если числа равны, функция также возвращает 1.</li>
                    </ul>
                </li>
            </ol>
            <p>Функция возвращает 1, если <code>value_1</code> больше или равно <code>value_2</code>, и 0 в противном случае.</p>
        `,
      },
      {
        type: "is_equal",
        title: "s21_is_equal",
        description: `Проверяет, равны ли два десятичных числа.
        Checks if two decimals are equal.`,
        code: `int s21_is_equal(s21_decimal value_1, s21_decimal value_2);`,
        details: [
            "Returns 1 if value_1 == value_2, otherwise 0.",
            "Return value: int (0 or 1)",
        ],
        longDescriptionHtml: `
            <h3>Функция s21_is_equal</h3>
            <p>Функция <code>s21_is_equal</code> определяет, равны ли два десятичных числа (<code>value_1</code> и <code>value_2</code>).</p>

            <h4>Принцип работы и реализация для s21_decimal:</h4>
            <ol>
                <li><b>Нормализация:</b> Оба числа <code>value_1</code> и <code>value_2</code> приводятся к одному и тому же масштабу (степени). Это необходимо для того, чтобы их мантиссы можно было корректно сравнивать.</li>
                <li><b>Сравнение знаков:</b>
                    <ul>
                        <li>Если знаки чисел разные, и ни одно из чисел не равно нулю, то числа не равны.</li>
                        <li>Если оба числа равны нулю, они считаются равными, независимо от знака или масштаба.</li>
                    </ul>
                </li>
                <li><b>Сравнение мантисс (при одинаковых знаках):</b> После нормализации масштабов сравниваются мантиссы. Если мантиссы <code>value_1</code> и <code>value_2</code> абсолютно идентичны, то числа равны.</li>
            </ol>
            <p>Функция возвращает 1, если <code>value_1</code> равно <code>value_2</code>, и 0 в противном случае.</p>
        `,
      },
      {
        type: "is_not_equal",
        title: "s21_is_not_equal",
        description: `Проверяет, не равны ли два десятичных числа.
        Checks if two decimals are not equal.`,
        code: `int s21_is_not_equal(s21_decimal value_1, s21_decimal value_2);`,
        details: [
            "Returns 1 if value_1 != value_2, otherwise 0.",
            "Return value: int (0 or 1)",
        ],
        longDescriptionHtml: `
            <h3>Функция s21_is_not_equal</h3>
            <p>Функция <code>s21_is_not_equal</code> определяет, не равны ли два десятичных числа (<code>value_1</code> и <code>value_2</code>).</p>

            <h4>Принцип работы и реализация для s21_decimal:</h4>
            <p>Реализация этой функции является прямой инверсией функции <code>s21_is_equal</code>.</p>
            <ol>
                <li><b>Использование s21_is_equal:</b> Функция <code>s21_is_not_equal</code> может быть реализована путем вызова <code>s21_is_equal(value_1, value_2)</code> и инвертирования его результата. Если <code>s21_is_equal</code> возвращает 1 (истина), то <code>s21_is_not_equal</code> возвращает 0 (ложь), и наоборот.</li>
                <li><b>Прямое сравнение:</b> Альтернативно, можно выполнить те же шаги нормализации, сравнения знаков и мантисс, что и в <code>s21_is_equal</code>, но возвращать 1, если хотя бы одно из условий равенства не выполняется.</li>
            </ol>
            <p>Функция возвращает 1, если <code>value_1</code> не равно <code>value_2</code>, и 0 в противном случае.</p>
        `,
      },
    ],
  },
};