let sessionKey;
let hasSessionKey = false;

let settings = {
  "host": 'soap.e-boekhouden.nl',
  "path": '/soap.asmx',
  "method": 'POST',
  "headers": {
    'Content-Type': 'text/xml; charset=utf-8',
  },
}

function init() {
  addRelation();
}

let openSession = () => {
  let openXml = `
  <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><OpenSession xmlns="http://www.e-boekhouden.nl/soap">
          <Username>Simlab-test</Username>
          <SecurityCode1>d51826f147c28f6ed51077a8f9589bc4</SecurityCode1>
          <SecurityCode2>97849692-9825-4571-B12D-95E599B84BB9</SecurityCode2>
        </OpenSession>
      </soap:Body>
    </soap:Envelope>
  `

  xmlCall(openXml.trim());
}

let closeSession = () => {
  let closeXml = `
  <?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CloseSession xmlns="http://www.e-boekhouden.nl/soap">
      <SessionID>${sessionKey}</SessionID>
    </CloseSession>
  </soap:Body>
</soap:Envelope>
  `

  xmlCall(closeXml.trim());
}

let addRelation = () => {
  console.log("begin --------------------------------------------------------------------------------------------")
  let relationXml = `
  <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <AddRelatie xmlns="http://www.e-boekhouden.nl/soap">
        <SessionID>${sessionKey}</SessionID>
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
  openSession()
  setTimeout(() => {
    console.log("\n")
    console.log(sessionKey);
    console.log("\n")
    xmlCall(relationXml.trim())
    setTimeout(() => {
      closeSession();
    }, 2000);
  }, 1000); 
}

let xmlCall = (xml) => {
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

init();