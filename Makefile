

target=main.html


all: $(target)

main.js: main.nw
	notangle -L $< > foo.js

main.html: main.nw
	noweave -filter l2h -index -html main.nw > main.html

clean: 
	rm *.dvi *.aux *.log *.html *.tex

