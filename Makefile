
# define variables
target=main
GC=notangle # no tangle will generate the code
GCFlAGS=-R

# latex stuff
GL=noweave  # no weave will generate the document
GLFLAGS=-latex

# pdf stuff
GP=pdflatex
GPFLAGS=-aux-directory=intDoc -output-directory=doc

## this would be all the files
docFiles  := $(foreach path,$(wildcard */*.nw *.nw), $(patsubst %, doc/%, $(path:%.nw=%.pdf)))
codeFiles := $(foreach path,$(wildcard */*.nw *.nw), $(patsubst %, code/%, $(path:%.nw=%.js)))

main: generateCode doc
# main:
# 	echo "allfiles: $(allFiles)"

# 
# the generate code target would generate the javascript files in the code folder
# the latex tag will generate all the latex files inside the latex folder
# the pdf tag will generate the documentation in the pdf tag
#







#
# ------------------------------------------------ code generation ----------------------------------------------------

## start generating the code
generateCode: setupCode $(codeFiles)
	echo "inside the generate code"

setupCode:
	mkdir ./code

code/%.js: %.nw
	@echo "the < has the value of $<, the @ = $@ the gcflags=$(GCFlAGS)"
	$(GC) $(GCFlAGS)$< $< > $@



## clean the code
cleanCode:
	rm -rf code

# ------------------------------------------------ end code generation ----------------------------------------------------









# ------------------------------------------- documentation  ---------------------------------------------------------
# This is the part that will generate the documentation

## generate the pdf
doc: setupDoc generatePdf

setupDoc:
	mkdir doc
	mkdir intDoc
	mkdir latexDoc

## this tells the makefile not to delete the latex file,
### usually when it creates files through chains, it treats them as an intermedtiate file and 
## deletes them, so this tells it not to
.PRECIOUS: latexDoc/%.latex

## generate all the pdfs
generatePdf: $(docFiles)
	echo "this is the pdf"

## generate the latex file when given the noweb file
latexDoc/%.latex: %.nw
	@echo "make latex: the < = $< and @ = $@"
	$(GL) $(GLFLAGS) $< > $@

## generate the pdf file when given the latex file
doc/%.pdf: latexDoc/%.latex
	@echo "make pdf: the < = $< and @ = $@, %=$%, ?=$?, ^=$^, *=$*"
	$(GP) $(GPFLAGS) $<

## clean all the files that relate to the documentation
cleanDoc:
	rm -rf doc intDoc latexDoc

# ------------------------------------------- end documentation  ---------------------------------------------------------#



### clean the project
clean: cleanDoc cleanCode



## run the testers
runTest:
	$(MAKE) -C test/Makefile test
	mocha





# ---------- old stuff -------
main.js: main.nw
	notangle -L $< > foo.js

main.pdf: main.nw
	noweave -latex main.nw > main.tex
	# noweave -filter l2h -index -latex main.nw > main.tex
	# pdflatex main.tex

main.html: main.nw
	noweave -filter l2h -index -html main.nw > main.html


