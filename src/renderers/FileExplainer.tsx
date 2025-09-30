import React from 'react';
import styles from './FileExplainer.module.css';

const fileStructure = [
  {
    folder: 'src',
    files: [
      { name: 's21_decimal.h', description: 'Основной заголовочный файл библиотеки.' },
      { name: 's21_add.c', description: 'Реализация функции сложения.' },
      { name: 's21_sub.c', description: 'Реализация функции вычитания.' },
      { name: 's21_mul.c', description: 'Реализация функции умножения.' },
      { name: 's21_div.c', description: 'Реализация функции деления.' },
      { name: 's21_add_diffrent_sign.c', description: 'Реализация функции сложения чисел с разными знаками.' },
      { name: 's21_add_mantissa.c', description: 'Реализация функции сложения мантисс.' },
      { name: 's21_add_same_sign.c', description: 'Реализация функции сложения чисел с одинаковыми знаками.' },
      { name: 's21_add_with_rounding.c', description: 'Реализация функции сложения с округлением.' },
      { name: 's21_apply_final_rounding.c', description: 'Применение финального округления.' },
      { name: 's21_bank_rounding.c', description: 'Реализация банковского округления.' },
      { name: 's21_bit_functions.c', description: 'Функции для работы с битами.' },
      { name: 's21_converters.c', description: 'Функции преобразования.' },
      { name: 's21_decrease_scale.c', description: 'Функция уменьшения масштаба.' },
      { name: 's21_divide_by_10.c', description: 'Функция деления на 10.' },
      { name: 's21_floor.c', description: 'Реализация функции floor.' },
      { name: 's21_from_float_to_decimal.c', description: 'Преобразование из float в decimal.' },
      { name: 's21_from_int_to_decimal.c', description: 'Преобразование из int в decimal.' },
      { name: 's21_get_scale.c', description: 'Получение масштаба.' },
      { name: 's21_get_sign.c', description: 'Получение знака.' },
      { name: 's21_is_equal.c', description: 'Реализация функции s21_is_equal.' },
      { name: 's21_is_even.c', description: 'Проверка на четность.' },
      { name: 's21_is_greater.c', description: 'Реализация функции s21_is_greater.' },
      { name: 's21_is_greater_or_equal.c', description: 'Реализация функции s21_is_greater_or_equal.' },
      { name: 's21_is_less.c', description: 'Реализация функции s21_is_less.' },
      { name: 's21_is_less_or_equal.c', description: 'Реализация функции s21_is_less_or_equal.' },
      { name: 's21_is_not_equal.c', description: 'Реализация функции s21_is_not_equal.' },
      { name: 's21_is_zero.c', description: 'Проверка на ноль.' },
      { name: 's21_mantissa_compare.c', description: 'Сравнение мантисс.' },
      { name: 's21_multiply_by_10.c', description: 'Умножение на 10.' },
      { name: 's21_negate.c', description: 'Реализация функции s21_negate.' },
      { name: 's21_normalize.c', description: 'Нормализация чисел.' },
      { name: 's21_print.c', description: 'Функции вывода.' },
      { name: 's21_reduce_to_scale.c', description: 'Уменьшение масштаба.' },
      { name: 's21_round.c', description: 'Реализация функции s21_round.' },
      { name: 's21_set_decimal_zero.c', description: 'Обнуление decimal.' },
      { name: 's21_set_scale.c', description: 'Установка масштаба.' },
      { name: 's21_set_sign.c', description: 'Установка знака.' },
      { name: 's21_shift_left.c', description: 'Сдвиг влево.' },
      { name: 's21_shift_right.c', description: 'Сдвиг вправо.' },
      { name: 's21_sub.c', description: 'Реализация функции вычитания.' },
      { name: 's21_sub_mantissa.c', description: 'Вычитание мантисс.' },
      { name: 's21_truncate.c', description: 'Реализация функции s21_truncate.' },
      { name: 's21_will_overflow_add.c', description: 'Проверка на переполнение при сложении.' },
      { name: 's21_will_overflow_left.c', description: 'Проверка на переполнение при сдвиге влево.' },
      { name: 'test.c', description: 'Тестовый файл.' },
    ],
  },
  {
    folder: 'tests',
    files: [
        { name: 's21_add_tests.c', description: 'Тесты для функции s21_add.' },
        { name: 's21_floor_tests.c', description: 'Тесты для функции s21_floor.' },
        { name: 's21_is_equal_tests.c', description: 'Тесты для функции s21_is_equal.' },
        { name: 's21_is_greater_or_equal_tests.c', description: 'Тесты для функции s21_is_greater_or_equal.' },
        { name: 's21_is_greater_tests.c', description: 'Тесты для функции s21_is_greater.' },
        { name: 's21_is_less_or_equal_tests.c', description: 'Тесты для функции s21_is_less_or_equal.' },
        { name: 's21_is_less_tests.c', description: 'Тесты для функции s21_is_less.' },
        { name: 's21_is_not_equal_tests.c', description: 'Тесты для функции s21_is_not_equal.' },
        { name: 's21_negate_tests.c', description: 'Тесты для функции s21_negate.' },
        { name: 's21_round_tests.c', description: 'Тесты для функции s21_round.' },
        { name: 's21_sub_tests.c', description: 'Тесты для функции s21_sub.' },
        { name: 's21_tests.c', description: 'Основной файл для запуска тестов.' },
        { name: 's21_tests.h', description: 'Заголовочный файл для тестов.' },
        { name: 's21_truncate_tests.c', description: 'Тесты для функции s21_truncate.' },
        { name: 'test', description: 'Исполняемый файл тестов.' },
    ],
  },
  {
    folder: 'other',
    files: [
      { name: '.clang-format', description: 'Конфигурация для форматирования кода Clang.' },
      { name: '21', description: 'Неизвестный файл.' },
      { name: 'Makefile', description: 'Файл для сборки проекта и управления им.' },
    ],
  },
];

const FileExplainer: React.FC = () => {
  return (
    <div className={styles.fileExplainerContainer}>
      <table className={styles.fileTable}>
        <thead>
          <tr>
            <th>Файл</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {fileStructure.map((section) => (
            <React.Fragment key={section.folder}>
              <tr>
                <th colSpan={2} className={styles.folderHeader}>{section.folder}</th>
              </tr>
              {section.files.map((file) => (
                <tr key={file.name}>
                  <td>{file.name}</td>
                  <td>{file.description}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileExplainer;