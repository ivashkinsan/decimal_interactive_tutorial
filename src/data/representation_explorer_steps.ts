export interface StepData {
  title: string;
  prologue: string;
  epilogue: string;
  interactiveComponent?: string; // e.g., 'mantissa-input', 'bits3-explorer'
}

export const representationExplorerSteps: StepData[] = [
  {
    title: 'Структура s21_decimal',
    prologue: 'Десятичное число s21_decimal представлено 96-битным целым числом (мантиссой) и информацией о знаке и масштабе.',
    epilogue: 'Далее мы рассмотрим каждую часть структуры подробнее.',
    interactiveComponent: 'full-decimal-visualizer',
  },
  {
    title: 'Мантисса',
    prologue: 'Мантисса - это 96-битное целое число, хранящее значащие цифры числа.',
    epilogue: 'Попробуйте ввести различные числа, чтобы увидеть, как меняется мантисса.',
    interactiveComponent: 'mantissa-input',
  },
  {
    title: 'Бит 3 (Знак и Масштаб)',
    prologue: 'Последний int (bits[3]) хранит информацию о знаке и масштабе числа.',
    epilogue: 'Изменяйте знак и масштаб, чтобы увидеть, как это влияет на биты.',
    interactiveComponent: 'bits3-explorer',
  },
  {
    title: 'Собираем все вместе',
    prologue: 'Теперь, когда вы понимаете отдельные части, давайте посмотрим на полный пример.',
    epilogue: 'Это завершает интерактивное исследование структуры s21_decimal.',
    interactiveComponent: 'final-example',
  },
];
