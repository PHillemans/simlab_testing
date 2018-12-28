let key = "05B68E2C-9FB2-4C6E-8E6F-11216206748A";

let settings = {
    "host": 'soap.e-boekhouden.nl',
    "path": '/soap.asmx',
    "method": 'POST',
    "headers": {
      'Content-Type': 'text/xml; charset=utf-8',
    },
  }

  let addRelation = () => {
    console.log("begin --------------------------------------------------------------------------------------------")
    let relationXml = `
    <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <AddRelatie xmlns="http://www.e-boekhouden.nl/soap">
          <SessionID>${key}</SessionID>
          <SecurityCode2>97849692-9825-4571-B12D-95E599B84BB9</SecurityCode2>
          <oRel>
            <Code>2</Code>
            <Bedrijf>Pepijn Hillemans</Bedrijf>
            <Geslacht>m</Geslacht>
            <Adres>Van t hoffstraat 10</Adres>
            <Postcode>4631HE</Postcode>
            <Plaats>Hoogerheide</Plaats>
            <Land>Nederland</Land>
          </oRel>
        </AddRelatie>
      </soap:Body>
    </soap:Envelope>
    `
      xmlCall(relationXml.trim())
  }

  let xmlCall = (xml) => {

    // console.log(xml)
    let http = require('http');
    let http_options = {
      hostname: settings.host,
      path: settings.path,
      method: settings.method,
      headers: settings.headers,
    }
    var req = http.request(http_options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(chunk)
        //check in xmlcall op sessionkey door eerst te parsen
        var submatch;
        var matches = chunk.match(/\{(.*?)\}/);
        if (matches) {
          submatch = matches[1];
          sessionKey = submatch;
        }
      });
  
    res.on('end', () => {
      console.log('No more data in response.')
    });
  });
  
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  
  // write data to request body
  req.write(xml); // xml would have been set somewhere to a complete xml document in the form of a string
  req.end();
  }

  addRelation();