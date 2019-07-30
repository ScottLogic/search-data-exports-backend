# Hybrid Report Generation
**Purpose:** This api is to generate a PDF to be presented to the user, which consists of an svg graph image build from ElasticSearch results, as well as plain text/table built into a PDF.

# Deployment for AWS Lambda
Because of limitation on AWS file sizes, the process for this has been split up for the node modules. Under `layers` there is a directory for each lambda layer this process requires.
+ **aws_puppet**
   + This layer is for the control of converting HTML into PDFs via puppeteer. And requires some specific setup when building the modules, else this will not work on AWS. To build this you must use `npm install --save-prod` as it will need to download platform specific modules to run on the linux based AWS.
+ **d3**
   + This layer contains D3 manipulation and AWS integration. This section can be built as normal with `npm install` and uploaded to the Lambda Layer as neede.

For the node modules to work within a lambda layer the `node_modules` directory **must** sit under a root directory called `nodejs`, hence the structure for the layers folders. To build the layer zip file up you would do the following process
```
   change directory to /layers/_layerName_/nodejs/
   npm install  (see note above.)
   change directory to /layers/_layerName_/
   zip * _layerName_.zip
```
The actual lambda to be deployed alongside the modules consists of a zip file containing
+ `./*.js`
+ `./common/*`
+ `./template/*`

`node_modules` is not be included as the lambda layers currently contain all modules needed


# Investigation
Under `./investigation` there is an example of how the process can work. by running `htmltopdf.js` using the command `node ./investigation/htmltopdf.js` it will generate a file called `html-pdf.pdf`. The design of this file should be a PDF version of `htmlbase.html`.
+ The width of SVG elements does not convert well/fully when made into a PDF. But as we control the make up / size of the SVG already we can always assert that this is the correct size to not cause scaling issues.
+ The Html template functions of this can be separated out, so we could use this as a way to make HTML reports as well as PDF ones.
+ Because the template is an html string, it is easier to modify and maintain files, as we can use inline CSS
