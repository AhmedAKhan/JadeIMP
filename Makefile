

target=main.pdf

all: $(target)

main.js: main.nw
	notangle -L $< > foo.js

main.pdf: main.nw
	noweave -latex main.nw > main.tex
	# noweave -filter l2h -index -latex main.nw > main.tex
	# pdflatex main.tex

main.html: main.nw
	noweave -filter l2h -index -html main.nw > main.html

clean: 
	rm *.dvi *.aux *.log *.html *.tex *.pdf

