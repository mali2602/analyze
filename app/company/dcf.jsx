"use strict";
import React from 'react'
import dcfService from '../dcfService.js';

function DiscountedCashflow(props) {
    const dcf = dcfService.calculateDcf(props.company);
    var fcfs =  dcf.fcfs.map(function(row, idx) {
        return <tr key={idx} className="row">
          <td className="text">{row.year}</td>
          <td className="text">{row.pv.toFixed(2)}</td>
          <td className="text">{row.fcf.toFixed(2)}</td>
        </tr>
    })
    return <div>
      <h2>Discounted Cash flows</h2>

      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr className="row">
                <td style={{width: 30 + '%'}} className="text">Average DCF</td>
                <td style={{width: 70 + '%'}} className="text">{dcf.avgDcf.toFixed(2)}</td>
            </tr>
            <tr className="row">
                <td className="text">FCF growth rates</td>
                <td className="text">{dcf.maxGrowthRate} - {dcf.minGrowthRate}</td>
            </tr>
            <tr className="row">
                <td className="text">FCF growth rates</td>
                <td className="text">{dcf.maxGrowthRate} - {dcf.minGrowthRate}</td>
            </tr>
            <tr className="row">
                <td className="text">Discount rate</td>
                <td className="text">{dcf.discountRate}</td>
            </tr>
            <tr className="row">
                <td className="text">Future cashflows</td>
                <td>
                    <table className="table">
                        <thead>
                            <th style={{width: 20 + '%'}}>Year</th>
                            <th style={{width: 40 + '%'}}>Present value</th>
                            <th style={{width: 40 + '%'}}>Future cash flow</th>
                        </thead>
                        {fcfs}
                    </table>
                </td>
            </tr>
            <tr className="row">
                <td className="text">DCF intrinsic value</td>
                <td className="text">{dcf.dcfValue.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>;
}

export default DiscountedCashflow
