#include "s21_tests.h"

int main() {
  Suite *suits_set[] = {s21_is_less_suite(),
                        s21_is_less_or_equal_suite(),
                        s21_is_greater_suite(),
                        s21_is_greater_or_equal_suite(),
                        s21_is_equal_suite(),
                        s21_is_not_equal_suite(),
                        s21_negate_suite(),
                        s21_truncate_suite(),
                        s21_round_suite(),
                        s21_floor_suite(),
                        s21_add_suite(),
                        s21_sub_suite(),
                        NULL};

  return (run_tests(suits_set) == 0) ? EXIT_SUCCESS : EXIT_FAILURE;
}

int run_tests(Suite **suits_set) {
  int failed = 0;

  for (int i = 0; suits_set[i] != NULL; i++) {
    SRunner *runner = srunner_create(suits_set[i]);

    srunner_set_fork_status(runner, CK_NOFORK);
    srunner_run_all(runner, CK_NORMAL);

    failed = srunner_ntests_failed(runner);

    srunner_free(runner);
  }

  return failed;
}