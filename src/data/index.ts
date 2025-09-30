import { conceptsContent } from './concepts_content';
import { filesContent } from './files_content';
import { comparisonContent } from './comparison_content';
import { bitwiseContent } from './bitwise_content';
import { arithmeticContent } from './arithmetic_content';
import { conversionContent } from './conversion_content';
import { otherContent } from './other_content';
import { bankersRoundingContent } from './bankers_rounding_content';
import { overflowContent } from './overflow_content';

// Создаем копию arithmeticContent и исключаем из нее s21-decimal-c-plan, чтобы избежать дублирования
const { 's21-decimal-c-plan': cPlan, ...arithmeticContentWithoutCPlan } = arithmeticContent;

export const allContentData = {
  's21-decimal-c-plan': cPlan, // Special case for C plan
  'separator_concepts': { title: 'Основные концепции', type: 'separator' },
  ...conceptsContent,
  'separator_files': { title: 'Обзор файлов проекта', type: 'separator' },
  ...filesContent,
  'separator_comparison': { title: 'Сравнение', type: 'separator' },
  ...comparisonContent,
  'separator_bitwise': { title: 'Побитовые операции', type: 'separator' },
  ...bitwiseContent,
  'separator_arithmetic': { title: 'Арифметика', type: 'separator' },
  ...arithmeticContentWithoutCPlan,
  'separator_conversion': { title: 'Преобразование', type: 'separator' },
  ...conversionContent,
  'separator_other': { title: 'Прочие функции', type: 'separator' },
  ...otherContent,
  'separator_rounding': { title: 'Округление', type: 'separator' },
  ...bankersRoundingContent,
  'separator_overflow': { title: 'Переполнение', type: 'separator' },
  ...overflowContent,
};

// Export all code snippets
export * from './code/s21_add_mantissa';
export * from './code/s21_bank_rounding';
export * from './code/s21_decrease_scale';
export * from './code/s21_divide_by_10';
export * from './code/s21_get_scale';
export * from './code/s21_get_sign';
export * from './code/s21_is_equal';
export * from './code/s21_is_even';
export * from './code/s21_is_greater';
export * from './code/s21_is_greater_or_equal';
export * from './code/s21_is_less';
export * from './code/s21_is_less_or_equal';
export * from './code/s21_is_not_equal';
export * from './code/s21_is_zero';
export * from './code/s21_mantissa_compare';
export * from './code/s21_multiply_by_10';
export * from './code/s21_normalize';
export * from './code/s21_set_scale';
export * from './code/s21_set_sign';
export * from './code/s21_shift_left';
export * from './code/s21_shift_right';
export * from './code/s21_will_overflow_add';
export * from './code/s21_will_overflow_left';
