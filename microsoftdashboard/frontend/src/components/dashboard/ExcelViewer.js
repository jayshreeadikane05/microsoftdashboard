import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelViewer = ({ fileUrl }) => {
  const [data, setData] = useState([]);

  const fetchExcelData = async () => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onload = (event) => {
      const bstr = event.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });

      // Get the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };

    reader.readAsBinaryString(blob);
  };

  useEffect(() => {
    fetchExcelData();
  }, [fileUrl]);

  return (
    <div style={{ height: 'min-content', width: '100%', overflow: 'hidden', overflowY: 'scroll', overflowX: 'auto' }}>
      <table className="table table-striped">
        <thead>
          <tr>
            {data[0] && Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelViewer;
