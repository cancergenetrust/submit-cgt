import convert from 'xml-js';
import XLSX from 'xlsx';

import React from 'react';
import ReactDOM from 'react-dom';

import Genomic from './genomic';
import Clinical from './clinical';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clinical: {},
      clinicalFilter: {},
      genomic: {},
    };
  }

  componentDidMount() {
    fetch('samples/genomic.xml')
      .then(response => response.text())
      .then(xml => convert.xml2js(xml, { compact: true }))
      .then(report => report['rr:ResultsReport']['rr:ResultsPayload']['variant-report'])
      .then(genomic => this.setState({ genomic }))
      .catch(error => console.log(error));

    fetch('clinicalFilter.tsv')
      .then(response => response.text())
      .then(tsv => tsv.split('\n').map(line => line.split('\t')))
      .then(array => array.reduce((obj, item) => {
        Object.assign(obj, { [item[0]]: item[2] }); return obj;
      }, {}))
      .then(clinicalFilter => this.setState({ clinicalFilter }))
      .catch(error => console.log(error));

    fetch('samples/clinical.xlsx')
      .then(response => response.arrayBuffer())
      .then((arrayBuffer) => {
        const data = new Uint8Array(arrayBuffer);
        const binaryString = data.reduce((acc, cur) => acc + String.fromCharCode(cur), '');
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const clinical = XLSX.utils.sheet_to_json(sheet, { range: 'A6:IQ7' })[0];
        this.setState({ clinical });
      })
      .catch(error => console.log(error));
  }

  render() {
    console.log('Rendering...');
    const filtered = Object.keys(this.state.clinical)
      .filter(key => this.state.clinicalFilter[key] !== '')
      .reduce((obj, key) => { obj[key] = this.state.clinical[key]; return obj; }, {});
    console.log(filtered);

    return (
      <div>
        <a href="http://www.cancergenetrust.org">
          <img
            alt="Cancer Gene Trust Logo"
            src="images/logo_with_name.png"
            style={{ padding: '8px', height: '64px' }}
            className="center-block img-responsive"
          />
        </a>
        <Clinical clinical={filtered} />
        <Genomic genomic={this.state.genomic} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
