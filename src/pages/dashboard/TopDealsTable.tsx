import React, { FC } from 'react';
import { TopDealsTableProps } from './types';
import './styles.css';

const TopDealsTable: FC<TopDealsTableProps> = ({ data }) => {
  const tableHeads = ['name', 'assigned_to', 'account_name', 'value'];

  const formatString = (input: string) => {
    if (!input) return '';

    return input
      .split('_')
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  };

  return (
    <div className="top-deals-table-container">
      <table>
        <thead>
          <tr>
            <th>No</th>
            {tableHeads.map((head, idx) => (
              <th key={'th-' + idx}>{formatString(head)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((deal, idx) => (
            <tr key={deal.id}>
              <td key={'no-' + idx}>{idx + 1}</td>
              {Object.entries(deal).map(([key, value]) => {
                if (tableHeads.includes(key)) {
                  if (key === 'assigned_to') {
                    return (
                      <td key={deal.id + key}>
                        {Array.isArray(value) && value.length !== 0
                          ? value.map((elem) => (
                              <p key={elem.id}>{elem.name || '---'}</p>
                            ))
                          : '---'}
                      </td>
                    );
                  }
                  return (
                    <td key={deal.id + key}>{(value as string) || '---'}</td>
                  );
                }
                return null;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopDealsTable;
