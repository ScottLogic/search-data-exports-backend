# Hybrid Report Generation
**Purpose:** This api is to generate a PDF to be presented to the user, which consists of an svg graph image build from ElasticSearch results, as well as plain text/table built into a PDF>

# Investigation
Under `./investigation` there is an example of how the process can work. by running `htmltopdf.js` using the command `node ./investigation/htmltopdf.js` it will generate a file called `html-pdf.pdf`. The design of this file should be a PDF version of `htmlbase.html`.
+ The width of SVG elements does not convert well/fully when made into a PDF. But as we control the make up / size of the SVG already we can always assert that this is the correct size to not cause scaling issues.
+ The Html template functions of this can be separated out, so we could use this as a way to make HTML reports as well as PDF ones.
+ Because the template is an html string, it is easier to modify and maintain files, as we can use inline CSS
