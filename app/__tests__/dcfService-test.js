'use strict';
/* global jest, require */
jest.disableAutomock()
import dcfService from '../dcfService.js';
import propertyAccessor from '../propertyAccessor.js';
var fs = require('fs');

describe('DCF Tests', function() {
  let data;
  beforeEach(function() {
    data =  JSON.parse(fs.readFileSync('/Users/mrangasw/Personal/lab/data/WIPRO/details-2017-12-30.json', 'utf8'));
    const investActivity = JSON.parse(fs.readFileSync('/Users/mrangasw/Personal/lab/data/WIPRO/investing-activity.json', 'utf8'));
    data.number_set.cashflow.push(...investActivity);
  });

  it('should calculate dcf', function() {
    const prop = propertyAccessor.getSome(data);
    // expect(prop).toEqual(-20.51);

    const result = dcfService.calculateDcf(data);
    expect(result.dcfValue).toEqual(3000);
    
  });
});
