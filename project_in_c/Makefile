all: clean s21_decimal.a

# Список всех .c файлов (кроме тестов)
SRC_FILES = $(wildcard s21_*.c)
OBJ_FILES = $(SRC_FILES:.c=.o)

s21_decimal.a: $(addprefix objs/, $(OBJ_FILES))
	ar rc s21_decimal.a $(addprefix objs/, $(OBJ_FILES))
	ranlib s21_decimal.a

objs/%.o: %.c
	mkdir -p objs
	gcc -std=c11 -Werror -Wall -Wextra -g -o $@ -c $<

build_test: clean s21_decimal.a
	gcc -std=c11 -Werror -Wall -Wextra -g ./tests/*.c -o ./tests/test -L. s21_decimal.a -lcheck -lm -lsubunit

test: build_test
	./tests/test

valgrind: test
	valgrind --tool=memcheck --leak-check=yes ./tests/test

gcov_report: clean
	mkdir -p report
	gcc -std=c11 -Werror -Wall -Wextra -g --coverage -fprofile-arcs -ftest-coverage $(SRC_FILES) ./tests/*.c -o report/gcov_test -lcheck -lgcov -lsubunit -lm
	./report/gcov_test
	lcov -t "s21_test" -o report/s21_test.info -c -d report --ignore-errors mismatch -o report/s21_test.info
	genhtml -o report report/s21_test.info
	xdg-open report/index.html

test_leaks: s21_decimal.a
	gcc -std=c11 -Werror -Wall -Wextra -g ./tests/*.c -o runfile -lcheck -lm -lsubunit -L. s21_decimal.a
	valgrind --tool=memcheck --leak-check=yes ./runfile

clang:
	cp ../materials/linters/.clang-format ./
	clang-format -i *.c *.h
	clang-format -i tests/*.c tests/*.h

check:
	cp ../materials/linters/.clang-format ./
	clang-format -n *.c *.h
	clang-format -n tests/*.c tests/*.h

clean:
	rm -rf s21_decimal.a objs
	rm -rf ./tests/test ./report/ runfile