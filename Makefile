

target=main.c


all: $(target)

main.c: main.nw
	notangle -L foo.nw > foo.c

main.h: main.nw
	notangle -Rheader foo.nw > xfoo.h
	-cmp -s xfoo.h foo.h || cp xfoo.h foo.h





