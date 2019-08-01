module.exports = ({ svgData = '', textInformation = '', tableData = [] }) => {
  let tableinformation = '';
  tableData.forEach((item) => {
    tableinformation += `<tr><td>${item.key}</td><td>${item.doc_count}</td></tr>`;
  });

  return `
  <html>
    <head>
        <title>Title Test</title>
        <style>
        body {
            padding: 0px;
            font-size: 16px;
            line-height: 24px;
            font-family: "Helvetica Neue", "Helvetica";
            color: #555;
        }
        .svgDiv {
            width:100%;
        }
        h1 {
            text-align: center;
            color: steelblue;
        }
        .page-content {
            width: 100%;
        }
        .page-content-col {
            width: 45%;
            margin: 1%;
            padding: 1%;
        }

        .page-content-col-left {
            float: left;
        }

        .page-content-col-right {
            float: right;
        }

        .page-content-frequency-table {
            width: 100%;
            border-collapse: collapse;
        }

        table,
        td,
        th {
            border-style: outset;
            border-width: 1px;
            border-color: gray;
            text-align: center;
        }

        th {
            font-weight: bold;
            background-color: steelblue;
            color: white;
        }
        </style>
    </head>
    <body>
        <h1>Hybrid Report Generation</h1>
        <hr />
        <div class="svgDiv">
            ${svgData}
        </div>
        <hr />
        <div class="page-content">
        <div class="page-content-col page-content-col-left">
            <h3>Tag Frequency</h3>
            <table class="page-content-frequency-table">
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Frequency</th>
                </tr>
            </thead>
            <tbody>
                ${tableinformation}
            </tbody>
            </table>
        </div>
        <div class="page-content-col page-content-col-right">
            <h3>Hybrid Report</h3>
            <p>
            This report is generated from a svg and table text, combined together
            via a HTML template which is used to format a PDF output. Benifits
            Include
            </p>
            <ul>
            <li>Easy to maintain template layout</li>
            <li>Use of stlying for elements.</li>
            <li>Includes SVG support</li>
            <li>
                Template can be used to generate HTML as well, for onscreen reports
                as well.
            </li>
            </ul>
            ${textInformation}
        </div>
        </div>
    </body>
  </html>
  `;
};
