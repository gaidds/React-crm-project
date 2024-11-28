import React, { FC } from 'react';
import { TopDealsTableProps } from './types';
import { Link } from 'react-router-dom';
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
                              <div className="assigned-to-item" key={elem.id}>
                                <Link to={`/app/users/${elem.id}`}>
                                  {elem.name || '---'}
                                </Link>
                              </div>
                            ))
                          : '---'}
                      </td>
                    );
                  }
                  if (key === 'name')
                    return (
                      <td key={deal.id + key}>
                        {deal.name ? (
                          <Link to={`/app/deals/${deal.id}`}>{deal.name}</Link>
                        ) : (
                          '---'
                        )}
                      </td>
                    );
                  if (key === 'account_name')
                    return (
                      <td key={deal.id + key}>
                        {deal.account_name ? (
                          <Link to={`/app/accounts/${deal.account_id}`}>
                            {deal.account_name}
                          </Link>
                        ) : (
                          '---'
                        )}
                      </td>
                    );
                  return (
                    <td key={deal.id + key}>
                      {`${key === 'value' ? '€ ' : ''} ${value as string}` ||
                        '---'}
                    </td>
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
