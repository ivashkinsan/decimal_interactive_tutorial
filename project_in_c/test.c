#include "s21_decimal.h"

int main() {
  s21_decimal v1;
  // int test1 = 2147483647;
  // int test2 = -2147483648;
  // int test3 = -255;
  // int test4 = 255;
  // int test5 = 0;
  float test6 = 1;
  // float test7 = ldexp(-1.0f, 95);
  // float test8 = 0;
  // float test9 = 0;
  // float test10 = 0;
  // float test3 = ldexp(1.0f, 95);
  // float test4 = ldexp(-1.0f, 95);
  float test7 = 255.255;
  int exponent = 0;
  int mantissa = frexp(test7, &exponent);
  printf("mantissa = %d\n, exponent = %d\n", mantissa, exponent);

  // printf("Test #1: %i\n", test1);
  // s21_from_int_to_decimal(test1, &v1);
  // printf("V1:\n");
  // s21_print(v1);
  //
  // printf("Test #2: %i\n", test2);
  // s21_from_int_to_decimal(test2, &v1);
  // printf("V2:\n");
  // s21_print(v1);
  //
  // printf("Test #3: %i\n", test3);
  // s21_from_int_to_decimal(test3, &v1);
  // printf("V3:\n");
  // s21_print(v1);
  //
  // printf("Test #4: %i\n", test4);
  // s21_from_int_to_decimal(test4, &v1);
  // printf("V4:\n");
  // s21_print(v1);
  //
  // printf("Test #5: %i\n", test5);
  // s21_from_int_to_decimal(test5, &v1);
  // printf("V5:\n");
  // s21_print(v1);

    printf("Test #6: %f\n", test6);
    s21_from_float_to_decimal(test6, &v1);
    printf("V6:\n");
    s21_print(v1);

  // printf("Test #7: %f\n", test6);
  // s21_from_float_to_decimal(test7, &v1);
  // printf("V7:\n");
  // s21_print(v1);

  // printf("Test #8: %i\n", test5);
  // s21_from_int_to_decimal(test5, &v1);
  // printf("V5:\n");
  // s21_print(v1);
  //
  // printf("Test #9: %i\n", test5);
  // s21_from_int_to_decimal(test5, &v1);
  // printf("V5:\n");
  // s21_print(v1);
  //
  // printf("Test #10: %i\n", test5);
  // s21_from_int_to_decimal(test5, &v1);
  // printf("V5:\n");
  // s21_print(v1);

  // s21_from_int_to_decimal(test3, &v1);
  // printf("V3:\n");
  // s21_print(v1);
  // s21_from_int_to_decimal(test4, &v1);
  // printf("V4:\n");
  // s21_print(v1);

  //  int s = 0;
  //  s = s21_is_less_or_equal(v1, v2);
  //  printf("func_returned: %d\n", s);
  // if(s==1) printf("TRUE:\n");
  // else printf("FALSE:\n");
  return 0;
}

// printf("AFTER:\n");
/*
  s21_decimal v1 = {{300000000,  0, 0, 8 << 16}};
    s21_decimal v2 = {{~0U,  0, 0, 9 << 16}};
    printf("BEFORE:\n");
    printf("V1:\n");
    s21_print(v1);
    printf("V2:\n");
    s21_print(v2);
    int s = 0;
    s = s21_is_less(v1, v2);
    printf("func_returned: %d\n", s);
   if(s==1) printf("TRUE:\n");
   else printf("FALSE:\n");

*/

/*
  s21_decimal v1 = {{-1,  0, 0, 7 << 16}};
    s21_decimal temp1 = v1;
    s21_decimal temp2 = v1;
    s21_shift_left(&temp1, 3);
    s21_shift_left(&temp2, 1);
    int scale = s21_get_scale(v1);

    printf("BEFORE:\n");
    printf("V1:\n");
    s21_print(v1);
     printf("temp1:\n");
    s21_print(temp1);
    printf("temp2:\n");
    s21_print(temp2);

    int s = 0;
    s = s21_add_mantissa(temp1, temp2, &v1);
    scale++;
    s21_set_scale(&v1, scale);
    printf("func_returned: %d\n", s);
     printf("AFTER:\n");
    printf("V1:\n");
    s21_print(v1);
*/