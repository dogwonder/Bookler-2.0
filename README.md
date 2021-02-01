## Bookler 2.0

Create PDF books from HTML

Based on [Bookler](https://github.com/felixcohen/Bookler) 

`npm install gulp --save-dev`

`npm install`

You might need to [manually install prince](https://www.princexml.com/doc/installing/) locally if npm install fails

### Build Process
`gulp` for development
`gulp build` for production abd PDF generation (builds to /dist)

[Prince XML](https://www.princexml.com/) can be used for non commercial purposes. If you wish to use this commerically [check out their website](https://www.princexml.com/purchase/).

### Data
The chapters files are rendered in markdown and located in the src/markdown folder. And data/data.json is where we define the chapters and toc. The chapter title name needs to match the mardown filename exactly.

The book title and subtitle are also defined in the data.json file.

### PDF
[Example file](example/book.pdf)